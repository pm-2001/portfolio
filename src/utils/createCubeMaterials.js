import * as THREE from 'three';

const createCubeMaterials = (faceLabels) => {
  return faceLabels.map(label => {
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
};

export default createCubeMaterials;