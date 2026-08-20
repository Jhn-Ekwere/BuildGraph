import { ProjectRepository } from '../repositories/project.repository.js';
import { getMockStore } from '../config/database.js';

const projectRepo = new ProjectRepository();

export class ProjectService {
  async getAllProjects() {
    const projects = await projectRepo.getAllProjects();
    if (!projects || projects.length === 0) {
      return getMockStore().projects;
    }
    return projects;
  }

  async getProjectById(id) {
    return await projectRepo.getProjectById(id);
  }
}
