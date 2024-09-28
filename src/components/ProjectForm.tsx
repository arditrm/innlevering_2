import React, { useState } from 'react';
import { Project } from './Types';

type ProjectFormProps = {
  onSubmit: (newProject: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject = {
      Title: projectName,
      Description: projectDescription,
    };
    onSubmit(newProject);
    setProjectName('');
    setProjectDescription('');
  };

  return (
    <section className="CreateProject">
      <form id="projectForm" onSubmit={handleSubmit}>
        <label htmlFor="PName">Project Title</label><br />
        <input
          type="text"
          id="PName"
          name="PName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        /><br />

        <label htmlFor="Description">Project Description</label><br />
        <textarea
          name="Description"
          id="Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
        /><br />

        <input type="submit" value="Create Project" /><br />
      </form>
    </section>
  );
};

export default ProjectForm;
