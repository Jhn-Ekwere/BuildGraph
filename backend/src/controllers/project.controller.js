import { ProjectService } from '../services/project.service.js';

const projectService = new ProjectService();

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    return res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    return res.json({
      success: true,
      data: project
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
