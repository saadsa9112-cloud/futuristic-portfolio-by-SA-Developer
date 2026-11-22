import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AmbientGlow from './components/AmbientGlow';
import TerminalLoader from './components/TerminalLoader';

export default function App() {
  const [data, setData] = useState({
    settings: null,
    stats: null,
    education: null,
    skills: [],
    projects: []
  });

  useEffect(() => {
    // Initialize AOS animations
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-out-cubic'
      });
    }

    // Attempt to fetch live data from MERN backend
    const fetchData = async () => {
      try {
        const [settingsRes, skillsRes, projectsRes] = await Promise.all([
          fetch('http://localhost:5000/api/settings').catch(() => null),
          fetch('http://localhost:5000/api/skills').catch(() => null),
          fetch('http://localhost:5000/api/projects').catch(() => null)
        ]);

        if (settingsRes && settingsRes.ok) {
          const sJson = await settingsRes.json();
          setData((prev) => ({
            ...prev,
            settings: sJson.data,
            stats: sJson.statistics,
            education: sJson.education
          }));
        }

        if (skillsRes && skillsRes.ok) {
          const skJson = await skillsRes.json();
          setData((prev) => ({ ...prev, skills: skJson.data }));
        }

        if (projectsRes && projectsRes.ok) {
          const pJson = await projectsRes.json();
          setData((prev) => ({ ...prev, projects: pJson.data }));
        }
      } catch (e) {
        console.log('Using default local portfolio data bundle.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="portfolio-app-root" style={{ background: '#0a0a12', minHeight: '100vh', color: '#fff' }}>
      {/* Visual Enhancers */}
      <CustomCursor />
      <AmbientGlow />
      <TerminalLoader />

      {/* Main Layout */}
      <Navbar />
      <main>
        <Hero settings={data.settings} stats={data.stats} />
        <About settings={data.settings} education={data.education} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Contact settings={data.settings} />
      </main>
      <Footer />
    </div>
  );
}
