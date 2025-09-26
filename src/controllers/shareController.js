const Model = require('../models/Model');
const SharedModel = require('../models/SharedModel');

// Generate share link for a model
const generateShareLink = async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.userId;

    // Verify the model exists
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({
        success: false,
        error: 'Model not found'
      });
    }

    // All authenticated users can share any model
    // Permission check removed as requested

    // Check if there's already an active share for this model
    let sharedModel = await SharedModel.findOne({
      modelId: modelId,
      sharedBy: userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (sharedModel) {
      // Update access count and return existing share
      sharedModel.lastAccessedAt = new Date();
      await sharedModel.save();

      return res.json({
        success: true,
        data: {
          shareUrl: sharedModel.shareUrl,
          authKey: sharedModel.authKey,
          expiresAt: sharedModel.expiresAt,
          accessCount: sharedModel.accessCount,
          isActive: sharedModel.isActive
        }
      });
    }

    // Create new share
    sharedModel = new SharedModel({
      modelId: modelId,
      sharedBy: userId
    });

    await sharedModel.save();

    res.json({
      success: true,
      data: {
        shareUrl: sharedModel.shareUrl,
        authKey: sharedModel.authKey,
        expiresAt: sharedModel.expiresAt,
        accessCount: sharedModel.accessCount,
        isActive: sharedModel.isActive
      }
    });

  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate share link'
    });
  }
};

// Disable share link
const disableShareLink = async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.userId;

    // Find active share for this model (any user can disable any share)
    const sharedModel = await SharedModel.findOne({
      modelId: modelId,
      isActive: true
    });

    if (!sharedModel) {
      return res.status(404).json({
        success: false,
        error: 'No active share found for this model'
      });
    }

    // Disable the share
    sharedModel.isActive = false;
    await sharedModel.save();

    res.json({
      success: true,
      message: 'Share link disabled successfully'
    });

  } catch (error) {
    console.error('Error disabling share link:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disable share link'
    });
  }
};

// Get share status for a model
const getShareStatus = async (req, res) => {
  try {
    const { modelId } = req.params;
    const userId = req.user.userId;

    const sharedModel = await SharedModel.findOne({
      modelId: modelId
    }).sort({ createdAt: -1 });


    if (!sharedModel) {
      return res.json({
        success: true,
        data: {
          isShared: false,
          shareUrl: null,
          expiresAt: null,
          accessCount: 0,
          isActive: false
        }
      });
    }

    res.json({
      success: true,
      data: {
        isShared: true,
        shareUrl: sharedModel.shareUrl,
        authKey: sharedModel.authKey,
        expiresAt: sharedModel.expiresAt,
        accessCount: sharedModel.accessCount,
        isActive: sharedModel.isActive && !sharedModel.isExpired,
        lastAccessedAt: sharedModel.lastAccessedAt
      }
    });

  } catch (error) {
    console.error('Error getting share status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get share status'
    });
  }
};

// View shared model (public endpoint)
const viewSharedModel = async (req, res) => {
  try {
    const { authKey } = req.params;

    // Find the shared model
    const sharedModel = await SharedModel.findOne({ authKey })
      .populate('modelId');

    if (!sharedModel) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Share Link Not Found</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white; }
                .error { color: #e74c3c; }
            </style>
        </head>
        <body>
            <h1 class="error">Share Link Not Found</h1>
            <p>The share link you're looking for doesn't exist or has been removed.</p>
        </body>
        </html>
      `);
    }

    // Check if share is valid
    if (!sharedModel.isValid) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Share Link Expired</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white; }
                .error { color: #e74c3c; }
            </style>
        </head>
        <body>
            <h1 class="error">Share Link Expired</h1>
            <p>This share link has expired or been disabled.</p>
        </body>
        </html>
      `);
    }

    // Update access count and last accessed
    sharedModel.accessCount += 1;
    sharedModel.lastAccessedAt = new Date();
    await sharedModel.save();

    // Get model data
    const model = sharedModel.modelId;
    const modelUrl = model.fileUrl || '/uploads/models/default.glb';
    
    // Return HTML page with Three.js viewer
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>3D Model Viewer - ${model.name}</title>
          <style>
              body { 
                  margin: 0; 
                  padding: 0; 
                  background: #1a1a1a; 
                  font-family: Arial, sans-serif; 
                  overflow: hidden;
              }
              #container { 
                  width: 100vw; 
                  height: 100vh; 
                  position: relative;
              }
              #info {
                  position: absolute;
                  top: 20px;
                  left: 20px;
                  background: rgba(0,0,0,0.8);
                  color: white;
                  padding: 15px;
                  border-radius: 8px;
                  max-width: 300px;
                  z-index: 100;
                  backdrop-filter: blur(10px);
              }
              #controls {
                  position: absolute;
                  bottom: 20px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: rgba(0,0,0,0.8);
                  color: white;
                  padding: 10px 20px;
                  border-radius: 25px;
                  z-index: 100;
                  backdrop-filter: blur(10px);
              }
              #loading {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-size: 18px;
                  z-index: 100;
                  text-align: center;
              }
              .spinner {
                  border: 3px solid rgba(255,255,255,0.3);
                  border-radius: 50%;
                  border-top: 3px solid white;
                  width: 30px;
                  height: 30px;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 10px;
              }
              @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
              }
              .hidden { display: none; }
              #close-info {
                  position: absolute;
                  top: 5px;
                  right: 10px;
                  background: none;
                  border: none;
                  color: white;
                  font-size: 18px;
                  cursor: pointer;
              }
          </style>
      </head>
      <body>
          <div id="container">
              <div id="loading">
                  <div class="spinner"></div>
                  Loading 3D Model...
              </div>
              <div id="info" class="hidden">
                  <button id="close-info">&times;</button>
                  <h3>${model.name}</h3>
                  <p>${model.description}</p>
                  <p><small>Shared by: ${sharedModel.sharedBy}</small></p>
                  <p><small>Views: ${sharedModel.accessCount}</small></p>
              </div>
              <div id="controls" class="hidden">
                  <span>🖱️ Drag to rotate • 🔍 Scroll to zoom • Right-click to pan</span>
              </div>
          </div>

          <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
          
          <script>
              let scene, camera, renderer, controls, model;
              const container = document.getElementById('container');
              const loading = document.getElementById('loading');
              const info = document.getElementById('info');
              const controlsDiv = document.getElementById('controls');
              const closeInfo = document.getElementById('close-info');

              function init() {
                  // Scene
                  scene = new THREE.Scene();
                  scene.background = new THREE.Color(0x2c2c2c);

                  // Camera
                  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                  camera.position.set(0, 0, 5);

                  // Renderer
                  renderer = new THREE.WebGLRenderer({ antialias: true });
                  renderer.setSize(window.innerWidth, window.innerHeight);
                  renderer.shadowMap.enabled = true;
                  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                  container.appendChild(renderer.domElement);

                  // Controls
                  controls = new THREE.OrbitControls(camera, renderer.domElement);
                  controls.enableDamping = true;
                  controls.dampingFactor = 0.05;

                  // Lighting
                  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
                  scene.add(ambientLight);

                  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                  directionalLight.position.set(10, 10, 5);
                  directionalLight.castShadow = true;
                  scene.add(directionalLight);

                  // Load model
                  loadModel('${modelUrl}');

                  // Event listeners
                  window.addEventListener('resize', onWindowResize);
                  closeInfo.addEventListener('click', () => {
                      info.classList.add('hidden');
                  });
              }

              function loadModel(url) {
                  const loader = new THREE.GLTFLoader();
                  
                  loader.load(
                      url,
                      function(gltf) {
                          model = gltf.scene;
                          scene.add(model);
                          
                          // Center and scale model
                          const box = new THREE.Box3().setFromObject(model);
                          const center = box.getCenter(new THREE.Vector3());
                          const size = box.getSize(new THREE.Vector3());
                          const maxDim = Math.max(size.x, size.y, size.z);
                          const scale = 2 / maxDim;
                          
                          model.scale.setScalar(scale);
                          model.position.sub(center.multiplyScalar(scale));
                          
                          // Hide loading, show info and controls
                          loading.classList.add('hidden');
                          info.classList.remove('hidden');
                          controlsDiv.classList.remove('hidden');
                          
                          animate();
                      },
                      function(progress) {
                          const percent = Math.round((progress.loaded / progress.total * 100));
                          loading.innerHTML = \`
                              <div class="spinner"></div>
                              Loading 3D Model... \${percent}%
                          \`;
                      },
                      function(error) {
                          console.error('Error loading model:', error);
                          loading.innerHTML = \`
                              <div style="color: #e74c3c;">❌ Error loading 3D model</div>
                              <p>Please check if the model file exists and is accessible.</p>
                          \`;
                      }
                  );
              }

              function animate() {
                  requestAnimationFrame(animate);
                  controls.update();
                  renderer.render(scene, camera);
              }

              function onWindowResize() {
                  camera.aspect = window.innerWidth / window.innerHeight;
                  camera.updateProjectionMatrix();
                  renderer.setSize(window.innerWidth, window.innerHeight);
              }

              // Start the application
              init();
          </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Error viewing shared model:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Error</title>
          <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white; }
              .error { color: #e74c3c; }
          </style>
      </head>
      <body>
          <h1 class="error">Error Loading Model</h1>
          <p>There was an error loading the shared model. Please try again later.</p>
      </body>
      </html>
    `);
  }
};

// Get all shared models by user
const getUserSharedModels = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Show all shared models (any user can see all shares)
    const sharedModels = await SharedModel.find({})
      .populate('modelId', 'name description fileUrl thumbnailUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SharedModel.countDocuments({});

    res.json({
      success: true,
      data: {
        sharedModels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting user shared models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get shared models'
    });
  }
};

module.exports = {
  generateShareLink,
  disableShareLink,
  getShareStatus,
  viewSharedModel,
  getUserSharedModels
};
