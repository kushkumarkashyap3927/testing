import { prisma } from "../config/prisma";
import Api, { apiError } from "../utils/apiRes.util";
import { fileManager } from "../lib/gemini";
import { genAI } from "../lib/gemini";
import fs from 'fs';



export const createProject = async (req: any, res: any, next: any) => {
  try {
    const { userId, projectName, project_description } = req.body;

    if (!userId || !projectName || !project_description) {
      return next(new apiError(400, "Missing required fields: userId, projectName, project_description"));
    }

    const project = await prisma.project.create({
      data: {
        projectName,
        project_description,
        userId,
      } as any,
    });

    return Api.success(res, project, "Project created successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to create project", [error?.message || String(error)], error?.stack));
  }
};

export const getProjectsByUserId = async (req: any, res: any, next: any) => {
  try {
    const userId = req.params.userId || req.query.userId || req.body.userId;
    if (!userId) return next(new apiError(400, "userId is required"));

    const projects = await prisma.project.findMany({ where: { userId } });
    return Api.success(res, projects, "Projects fetched successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to fetch projects", [error?.message || String(error)], error?.stack));
  }
};


export const getProjectById = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return next(new apiError(400, "projectId is required"));

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return next(new apiError(404, "Project not found"));

    return Api.success(res, project, "Project fetched successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to fetch project", [error?.message || String(error)], error?.stack));
  }
};


export const updateProject = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    const { projectName, project_description, status } = req.body;

    if (!projectId) return next(new apiError(400, "projectId is required"));

    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existingProject) return next(new apiError(404, "Project not found"));

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        projectName,
        project_description,
        status,
      } as any,
    });

    return Api.success(res, updatedProject, "Project updated successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to update project", [error?.message || String(error)], error?.stack));
  }
};

export const deleteProject = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return next(new apiError(400, "projectId is required"));

    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existingProject) return next(new apiError(404, "Project not found"));

    await prisma.project.delete({ where: { id: projectId } });
    return Api.success(res, null, "Project deleted successfully");
  } catch (error: any) {
    console.error(error);
    return next(new apiError(500, "Failed to delete project", [error?.message || String(error)], error?.stack));
  }
};


// step 0 - receive files and projectId


export const uploadProjectFiles = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!projectId) return next(new apiError(400, "ProjectId is required"));
    if (!files || files.length === 0) return next(new apiError(400, "No files uploaded"));

    const uploadPromises = files.map(async (file) => {
      const uploadResponse = await fileManager.uploadFile(file.path, {
        mimeType: file.mimetype,
        displayName: file.originalname,
      });

      fs.unlinkSync(file.path);

      return {
        name: file.originalname,
        url: uploadResponse.file.uri,
      };
    });
    const uploadedFileData = await Promise.all(uploadPromises);

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        files: {
          push: uploadedFileData,
        },
        status: 1,
      },
    });

    return Api.success(res, updatedProject, "Files ingested successfully");
  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return next(new apiError(500, "Ingestion Failed", [error.message]));
  }
}; 


// step 1 - map stakeholders name , role  with streaming response
export const mapStakeholders = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    const { relevantChats } = req.body; 

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return next(new apiError(404, "Project not found"));

    // Validation: Require some form of context
    if (project.status < 1 && (!relevantChats || relevantChats.length === 0)) {
      return next(new apiError(400, "No context available. Upload files or provide chats."));
    }

    // SSE Setup
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" } 
    });

    const prompt = `
      You are the Anvaya.Ai Identity Engine. 
      Analyze the context for Project: ${project.projectName}.

      TASK:
      Identify all unique stakeholders mentioned in the documents or chats.
      
      OUTPUT:
      Return a JSON array of objects. Keys: "name", "role".
      Example: [{"name": "Alex Chen", "role": "Head of Engineering"}]
    `;

    const parts: any[] = [prompt];
    if (project.files?.length > 0) {
      project.files.forEach((f: any) => {
        parts.push({ fileData: { mimeType: "application/pdf", fileUri: f.url } });
      });
    }
    if (relevantChats) parts.push(`Contextual Chats: ${JSON.stringify(relevantChats)}`);

    const result = await model.generateContentStream(parts);
    let fullResponse = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      // Stream "Thinking" to Left Panel
      res.write(`data: ${JSON.stringify({ type: "thinking", text: chunkText })}\n\n`);
    }

    try {
      const stakeholders = JSON.parse(fullResponse);
      
      // Save only Name and Role
      await prisma.stakeholder.createMany({
        data: stakeholders.map((s: any) => ({
          name: s.name,
          role: s.role,
          projectId: projectId
        }))
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { status: 2 } // Move to "Stakeholders Identified"
      });

      // Send result to Right Panel
      res.write(`data: ${JSON.stringify({ type: "result", data: stakeholders })}\n\n`);
    } catch (e) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Logic parsing failed" })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error: any) {
    console.error("Stage 1 Error:", error);
    res.end();
  }
};


