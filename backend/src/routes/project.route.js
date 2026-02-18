import { Router } from 'express';
import { createProject , getProjectById, getProjects ,deleteProject , updateProject } from '../controlles/project.controller.js';

const projectRouter = Router();

projectRouter.post('/create', createProject);
projectRouter.get('/getProjects', getProjects);
projectRouter.get('/getProject/:projectId', getProjectById);
projectRouter.delete('/deleteProject/:projectId', deleteProject);
projectRouter.put('/updateProject/:projectId', updateProject);



export default projectRouter;
