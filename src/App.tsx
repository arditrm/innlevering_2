import React, { useState, useEffect } from 'react';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import {Project} from './components/Types';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch('http://localhost:4000/json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectSubmit = async (newProject: Project) => {
    try {
      await fetch('http://localhost:4000/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });
      fetchDataFromServer();
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <main>
      <header>
        <h1>New Project</h1>
      </header>
      <ProjectForm onSubmit={handleProjectSubmit} />
      <section className="ViewProjectHeader">
        <header>
          <h2>Projects</h2>
        </header>
      
      </section>
      <ProjectList projects={projects} />
    </main>
  );
};

export default App;
