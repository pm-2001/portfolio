import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import createCubeMaterials from '../utils/createCubeMaterials';
import '../styles/App.css';

function CubePortfolio() {
  const mountRef = useRef(null);
  const [selectedFace, setSelectedFace] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const faceLabels = ['About', 'Skills', 'Projects', 'Experience', 'Contact', 'Resume'];
    const materials = createCubeMaterials(faceLabels);

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

    const onPointerDown = () => (isDragging = false);
    const onPointerMove = () => (isDragging = true);
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

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('click', onMouseClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('click', onMouseClick);
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
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