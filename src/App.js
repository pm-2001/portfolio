import React from 'react';
import CubePortfolio from './components/CubePortfolio';
import './styles/App.css';
import cubeImage from './assets/cube.png'; // Make sure to place your image here
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

function App() {
  return (
    <div className="container">
      <header className="header">
        <div className="logo">Prince</div>
        <a href="/Prince_Maurya_CV.pdf" className="cv-button" download>
          Download CV
        </a>
      </header>

      <main className="main">
        <div className="cube-container">
          <img src={cubeImage} alt="Cube" className="cube-image" height={300} width={300}/>
        </div>
        <div className="intro-text">
          <h1>Hello !</h1>
          <h2>I am Prince</h2>
          <p>Developer | Designer | Coder</p>
        </div>
      </main>

      <footer className="footer">
        <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://instagram.com/yourinstagram" target="_blank" rel="noreferrer">
          <FaInstagram />
        </a>
      </footer>
    </div>
  );
}

export default App;
