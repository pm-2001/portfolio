// Cube Portfolio with Click Detection and Info Display
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';

function CubePortfolio() {
  const mountRef = useRef(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;
    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountNode.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const faceLabels = ['About', 'Skills', 'Projects', 'Experience', 'Contact', 'Resume'];
    const materials = faceLabels.map(label => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffcc00';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = '#000';
      context.lineWidth = 10;
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.font = 'bold 24px Arial';
      context.fillStyle = '#000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(label, canvas.width / 2, canvas.height / 2);
      const texture = new THREE.CanvasTexture(canvas);
      return new THREE.MeshBasicMaterial({ map: texture });
    });

    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;

    renderer.domElement.addEventListener('pointerdown', () => isDragging = false);
    renderer.domElement.addEventListener('pointermove', () => isDragging = true);

    const onMouseClick = (event) => {
      if (isDragging) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube, true);

      if (intersects.length > 0) {
        const faceIndex = Math.floor(intersects[0].faceIndex / 2);
        const label = faceLabels[faceIndex];
        setSelectedFace(label);
        setShowDialog(true);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      if (mountNode && renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  const renderDialogContent = () => {
    switch (selectedFace) {
      case 'About':
        return <p>I am Prince Maurya, a full-stack dev & designer.</p>;
      case 'Projects':
        return <p>Explore some exciting projects I’ve built!</p>;
      case 'Experience':
        return <p>Currently at Socialsense. Formerly at 88 Ventures.</p>;
      case 'Contact':
        return <p>Email: princemauryapm2001@gmail.com</p>;
      case 'Resume':
        return <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download Resume</a>;
      default:
        return <p>Click a face to learn more.</p>;
    }
  };

  return (
    <div className="portfolio-wrapper">
      <div ref={mountRef} className="canvas-container" />
      {showDialog && (
        <div className="dialog-box">
          <h3>{selectedFace}</h3>
          <div className="dialog-content">{renderDialogContent()}</div>
          <button onClick={() => setShowDialog(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default CubePortfolio;