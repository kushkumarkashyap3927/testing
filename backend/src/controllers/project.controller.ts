import { prisma } from "../config/prisma";
import Api, { apiError } from "../utils/apiRes.util";
import {z} from "zod";

import { ai } from "../lib/gemini";



import fs from "fs";


export const createProject = async (req: any, res: any, next: any) => {
  try {
    const { userId, projectName, project_description } = req.body;

    if (!userId || !projectName || !project_description) {
      return next(
        new apiError(
          400,
          "Missing required fields: userId, projectName, project_description",
        ),
      );
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
    return next(
      new apiError(
        500,
        "Failed to create project",
        [error?.message || String(error)],
        error?.stack,
      ),
    );
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
    return next(
      new apiError(
        500,
        "Failed to fetch projects",
        [error?.message || String(error)],
        error?.stack,
      ),
    );
  }
};

export const getProjectById = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return next(new apiError(400, "projectId is required"));

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) return next(new apiError(404, "Project not found"));

    return Api.success(res, project, "Project fetched successfully");
  } catch (error: any) {
    console.error(error);
    return next(
      new apiError(
        500,
        "Failed to fetch project",
        [error?.message || String(error)],
        error?.stack,
      ),
    );
  }
};

export const updateProject = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    const { projectName, project_description, status } = req.body;

    if (!projectId) return next(new apiError(400, "projectId is required"));

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });
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
    return next(
      new apiError(
        500,
        "Failed to update project",
        [error?.message || String(error)],
        error?.stack,
      ),
    );
  }
};

export const deleteProject = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    if (!projectId) return next(new apiError(400, "projectId is required"));

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!existingProject) return next(new apiError(404, "Project not found"));

    await prisma.project.delete({ where: { id: projectId } });
    return Api.success(res, null, "Project deleted successfully");
  } catch (error: any) {
    console.error(error);
    return next(
      new apiError(
        500,
        "Failed to delete project",
        [error?.message || String(error)],
        error?.stack,
      ),
    );
  }
};

// step 0 - receive files and projectId

/*
  const myfile = await ai.files.upload({
    file: "path/to/sample.mp3",
    config: { mimeType: "audio/mpeg" },
  });

  const fileName = myfile.name;
  const fetchedFile = await ai.files.get({ name: fileName });
  console.log(fetchedFile);
}
   */

export const uploadProjectFiles = async (req: any, res: any, next: any) => {
  try {
    const { projectId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!projectId) return next(new apiError(400, "ProjectId is required"));
    if (!files || files.length === 0) return next(new apiError(400, "No files uploaded"));

    // 2. Process and Upload to Google Files API
    const uploadPromises = files.map(async (file) => {
      // Upload using the new syntax
      const uploadResponse = await ai.files.upload({
        file: file.path, 
        config: { 
          mimeType: file.mimetype,
          displayName: file.originalname 
        },
      });

      // Cleanup local disk immediately after upload
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Return the data structure your DB expects
      return {
        name: file.originalname,
        url: uploadResponse.uri ?? "", // Ensure url is always a string
      };
    });

    const uploadedFileData = await Promise.all(uploadPromises);

    // 3. Update Project Status & Store File Metadata
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        files: {
          push: uploadedFileData, // Prisma handles the array push in MongoDB
        },
        status: 1, // Progress to "Context Ingested"
      },
    });

    return Api.success(res, updatedProject, "Files ingested and synced to Google AI Cloud.");
  } catch (error: any) {
    console.error("Unified Ingestion Error:", error);
    return next(new apiError(500, "Ingestion Failed", [error.message]));
  }
};





const extractionSchema = z.object({
  stakeholders: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      influence: z.string(),
      stance: z.string(),
    })
  )
  });

export const mapStakeholders = async (req: any, res: any, next: any) => {
 
    const { projectId } = req.params;
    const { relevantChats } = req.body; // Expecting an array of chat objects or a joined string
    
    if (!projectId) return next(new apiError(400, "ProjectId is required"));
    if (!relevantChats || (Array.isArray(relevantChats) && relevantChats.length === 0)) {
      return next(new apiError(400, "Relevant chat history is required"));
    }
    
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return next(new apiError(404, "Project not found"));
    
    const prompt = `
  SYSTEM ROLE: Expert Business Systems Analyst & Entity Extractor.
  
  TASK: Extract a clean list of stakeholders from the provided Project Context and Communication Data. 
  
  STRICT GROUNDING RULES:
  1. ONLY extract individuals or entities explicitly named in the "relevant" data streams.
  2. DO NOT hallucinate or "fill in" missing data. If Influence or Stance is not clear, use "Neutral" or "Medium".
  3. IGNORE all entries where "is_relevant" is false (e.g., family chats, social football groups).
  4. PROJECT SCOPE: Focus exclusively on stakeholders related to "${project.projectName}".

  INPUT DATA:
  - Project Description: ${project.project_description}
  - Data Vault JSON: ${JSON.stringify(relevantChats)}

  EXTRACTION LOGIC:
  - Identify Name & Role from Participant lists, Signatures, or Speaker tags.
  - Determine 'Influence': Look for budget authority (CFO), technical veto power (CTO), or final decision rights (CEO).
  - Determine 'Stance': Analyze sentiment. (e.g., Is the CFO "Blocking" a budget? Is the CEO "Supportive" of speed over security?)

  OUTPUT: Return a JSON object with a 'stakeholders' array.
`;

    // Define plain JSON schema for Gemini (must match our Zod `extractionSchema`)
    const extractionJsonSchema = {
      type: "object",
      properties: {
        stakeholders: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              role: { type: "string" },
              influence: { type: "string", enum: ["High", "Medium", "Low"] },
              stance: { type: "string", enum: ["Supportive", "Neutral", "Skeptical", "Blocking"] },
            },
            required: ["name", "role", "influence", "stance"],
          },
        },
      },
      required: ["stakeholders"],
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: extractionJsonSchema,
        },
      });

      const parsedData = JSON.parse(response.text ?? "{}");
      const stakeholders = extractionSchema.parse(parsedData).stakeholders;

      // Save stakeholders to DB (assuming a Stakeholder model with name, role, and projectId)
      const savedStakeholders = await Promise.all(stakeholders.map((s: any) =>
        prisma.stakeholder.create({
          data: {
            name: s.name,
            role: s.role,
            influence: s.influence ?? null,
            stance: s.stance ?? null,
            projectId: projectId,
          },
        })
      ));

      return Api.success(res, savedStakeholders, "Stakeholders extracted and saved successfully");
    } catch (error: any) {
      console.error("Stakeholder Extraction Error:", error);
      return next(new apiError(500, "Failed to extract stakeholders", [error.message]));
    }
};

/*
type File {
  name String
  url  String
}

model Project {
  id                        String          @id @default(auto()) @map("_id") @db.ObjectId
  projectName               String
  project_description       String
  included_messaging_source String[]      @default([])
files                        File[]
  brdMdx                    String?
  status                    Int              @default(0)
  userId                    String          @db.ObjectId
  createdAt                 DateTime        @default(now())
  updatedAt                 DateTime        @updatedAt

  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  stakeholders   Stakeholder[]
  facts          Fact[]
  contradictions Contradiction[]
  resolutions    Resolution[]
}

model Stakeholder {
  id        String @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  role      String
  influence String?
  stance    String?
  projectId String @db.ObjectId

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model Fact {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  content    String
  source     String
  tone       String
  when       DateTime
  resolved   Boolean @default(true)
  projectId  String   @db.ObjectId
 sourceType FactSourceType
 stackHolderId String?  @db.ObjectId

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
 */


// algo :
/* 
1. Receive projectId and relevant chat history from frontend.
2. Fetch project details (name, description, files) from DB using projectId.
3. fetch stackholders from db using projectId so it can map in facts 
4. convention of source is if 
it whatsapp  whataspp/chatname
if email email/to
3. Construct a prompt combining project details and chat history.


*/



// const extractFactsDataSchema = z.object({
//   facts: z.array(
//     z.object({
//       fact: z.string(),
//     })
//   )
// });