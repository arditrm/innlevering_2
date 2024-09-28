import React from 'react';
import { Project } from './Types';

type ProjectListProps = {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <section className="DisplayProjects">
      <article>
        <ul id="Projects">
          {projects.map((project, index) => (
            <li key={index}>
              <article>
                <h3>{project.Title}</h3>
                <p>{project.Description}</p>
              </article>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
};

export default ProjectList;
