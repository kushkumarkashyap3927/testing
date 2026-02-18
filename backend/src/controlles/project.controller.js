import Project from "../models/project.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";


export const createProject = asyncHandler(async (req, res) => {
    const { projectName, project_description ,id } = req.body;

    const project = await Project.create({
        projectName,
        project_description,
        userId: id
    });

    if (!project) throw new apiError(400, "Project creation failed");

    return res.status(200).json(new apiRes(200, { project }, "Project created successfully"));
});



export const getProjects = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const projects = await Project.find({ userId: id });

    if (!projects) throw new apiError(404, "No projects found for this user");

    return res.status(200).json(new apiRes(200, { projects }, "Projects retrieved successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) throw new apiError(404, "Project not found");

    return res.status(200).json(new apiRes(200, { project }, "Project retrieved successfully"));
});


export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) throw new apiError(404, "Project not found");

    return res.status(200).json(new apiRes(200, null, "Project deleted successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { projectName, project_description, included_messaging_source, files, brdMdx, status } = req.body;

    const project = await Project.findByIdAndUpdate(
        projectId,
        { projectName, project_description, included_messaging_source, files, brdMdx, status },
        { new: true }
    );

    if (!project) throw new apiError(404, "Project not found");

    return res.status(200).json(new apiRes(200, { project }, "Project updated successfully"));
});