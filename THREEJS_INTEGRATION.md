# Three.js Integration Guide

This document explains how to integrate Three.js for 3D model viewing in the MadrassaPlay 3D Model Management System.

## Overview

The system is designed to work with Three.js for rendering GLB 3D models. The frontend components are already prepared for Three.js integration.

## Components Ready for Three.js

### 1. Model3dViewerModal
- **Location**: `client/src/components/shared/Model3dViewerModal.jsx`
- **Purpose**: Modal component for viewing 3D models
- **Features**:
  - Model information display
  - Share URL generation (for teachers)
  - Responsive design
  - Ready for Three.js iframe integration

### 2. ModelCard
- **Location**: `client/src/components/shared/ModelCard.jsx`
- **Purpose**: Card component displaying model information
- **Features**:
  - Model preview placeholder
  - Category and tag display
  - Action buttons (Inspect, Edit, Delete, Share)

## Integration Steps

### 1. Install Three.js Dependencies

```bash
cd client
npm install three @types/three
```

### 2. Create Three.js Viewer Component

Create a new component `client/src/components/shared/ThreeJSViewer.jsx`:

```jsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const ThreeJSViewer = ({ modelUrl, className = "w-full h-96" }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load model
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          model.scale.setScalar(1);
          model.position.set(0, 0, 0);
          model.castShadow = true;
          model.receiveShadow = true;
          scene.add(model);

          // Center the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.error('Error loading model:', error);
        }
      );
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  return <div ref={mountRef} className={className} />;
};

export default ThreeJSViewer;
```

### 3. Update Model3dViewerModal

Replace the iframe section in `Model3dViewerModal.jsx`:

```jsx
// Replace this section:
<div className="w-full h-96 bg-gray-100 rounded-lg mb-4">
  {shareUrl ? (
    <iframe
      src={shareUrl}
      className="w-full h-full rounded-lg border-0"
      title={`3D Model: ${model.name}`}
    />
  ) : (
    // ... loading state
  )}
</div>

// With this:
<div className="w-full h-96 bg-gray-100 rounded-lg mb-4">
  {model?.fileUrl ? (
    <ThreeJSViewer 
      modelUrl={model.fileUrl} 
      className="w-full h-full rounded-lg" 
    />
  ) : (
    // ... loading state
  )}
</div>
```

### 4. Update Model Schema

Ensure the Model schema includes the `fileUrl` virtual field (already implemented):

```javascript
// In 3d-server/src/models/Model.js
modelSchema.virtual('fileUrl').get(function() {
    return `/uploads/models/${this.filePath.split('/').pop()}`;
});
```

### 5. Serve Static Files

Ensure the 3D server serves static files correctly (already configured):

```javascript
// In 3d-server/server.js
app.use(express.static('public'));
```

## API Endpoints

### Model URLs
- **Admin**: `http://localhost:3001/admin/models` - Full CRUD operations
- **Teacher**: `http://localhost:3001/api/models` - Read-only access
- **Student**: `http://localhost:3001/view/:modelId?token=:token` - Shared model access

### File Access
- **Model Files**: `http://localhost:3001/uploads/models/:filename`
- **Thumbnails**: `http://localhost:3001/uploads/thumbnails/:filename`

## Features Implemented

### Admin Features
- ✅ Upload GLB models with category/tag assignment
- ✅ Edit model information, categories, and tags
- ✅ Delete models (with file cleanup)
- ✅ Full category CRUD operations
- ✅ Full tag CRUD operations
- ✅ Filter models by category/tag
- ✅ 3D model viewing (ready for Three.js)

### Teacher Features
- ✅ Browse available models
- ✅ Filter by category/tag
- ✅ View 3D models (ready for Three.js)
- ✅ Generate shareable links for students
- ✅ Copy share URLs to clipboard

### Student Features
- ✅ Access shared models via token URLs
- ✅ View 3D models (ready for Three.js)

## Testing

1. Start the 3D server: `cd 3d-server && npm start`
2. Start the client: `cd client && npm run dev`
3. Access admin panel: `http://localhost:5173/admin/model3d`
4. Access teacher library: `http://localhost:5173/teacher/model3d`

## Next Steps

1. Install Three.js dependencies
2. Create the ThreeJSViewer component
3. Update Model3dViewerModal to use ThreeJSViewer
4. Test model loading and interaction
5. Add additional Three.js features (animations, materials, etc.)

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure CORS is properly configured in the 3D server
2. **File not found**: Check that uploaded files are in the correct directory
3. **Model not loading**: Verify GLB file format and Three.js loader setup
4. **Performance issues**: Consider model optimization and LOD (Level of Detail)

### Debug Tips
- Check browser console for Three.js errors
- Verify model URLs are accessible
- Test with simple GLB files first
- Use Three.js examples as reference
