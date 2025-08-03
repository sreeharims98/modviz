# ModViz

A modern, open-source 3D model viewer and material editor built with Next.js, Three.js, and React. Upload GLB models and visualize them with real-time material editing capabilities.

![ModViz](https://img.shields.io/badge/ModViz-3D%20Viewer-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![Three.js](https://img.shields.io/badge/Three.js-0.178.0-orange)
![React](https://img.shields.io/badge/React-19.1.0-blue)

## ✨ Features

### 🎨 Material Editing

- **Color Control**: Adjust material colors with real-time preview
- **Metallic Properties**: Fine-tune metallic and roughness values
- **Emission**: Add glowing effects to materials
- **Material Selection**: Choose from multiple materials in your model

### 🌍 Environment & Lighting

- **HDR Environment Maps**: Upload custom HDR files for realistic lighting
- **Environment Blur**: Adjust environment blurriness for different lighting effects
- **Skybox Toggle**: Switch between HDR environment and skybox
- **Dynamic Lighting**: Real-time lighting adjustments

### 📁 Model Management

- **GLB File Support**: Upload and view GLB/GLTF models
- **Drag & Drop**: Intuitive drag-and-drop file upload
- **Auto-centering**: Models are automatically centered and scaled
- **Animation Support**: View and control model animations

### 🎛️ User Interface

- **Modern UI**: Clean, responsive interface built with Radix UI
- **Real-time Preview**: See changes instantly in the 3D viewport
- **Panel System**: Organized controls in collapsible panels
- **Dark Theme**: Beautiful dark theme with gradient accents

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Uploading a Model

1. **Drag and Drop**: Simply drag a GLB file onto the viewer area
2. **Browse Files**: Click the upload area to browse and select a GLB file
3. **Supported Formats**: GLB, GLTF files are supported

### Editing Materials

1. **Select Material**: Choose a material from the dropdown in the Materials panel
2. **Adjust Properties**:
   - **Color**: Use the color picker to change material color
   - **Metallic**: Adjust the metallic value (0-1)
   - **Roughness**: Control surface roughness (0-1)
   - **Emission**: Add glowing effects with color and intensity

### Environment Settings

1. **Upload HDR**: Drag an HDR file onto the environment upload area
2. **Adjust Blur**: Use the blur slider to control environment blurriness
3. **Toggle Skybox**: Switch between HDR environment and skybox mode

### Scene Controls

- **Orbit**: Click and drag to rotate around the model
- **Zoom**: Scroll to zoom in/out
- **Pan**: Right-click and drag to pan the view

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.2, React 19.1.0
- **3D Graphics**: Three.js 0.178.0
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Build Tool**: Turbopack

## 📁 Project Structure

```
mod-viz/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── accordions/      # Accordion components
│   │   ├── panels/          # Control panels
│   │   └── ui/              # UI components
│   ├── context/             # React context
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── package.json
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [Next.js](https://nextjs.org/) - React framework
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**ModViz** - Visualize and edit 3D models with ease! 🎨✨
