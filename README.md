# 3D Shoe Customizer PWA

A Progressive Web App for customizing 3D shoes built with React, Three.js, and modern web technologies.

## Features

- 🎨 **Interactive 3D Customization**: Real-time shoe customization with color, material, and style options
- 📱 **Progressive Web App**: Installable on any device with offline capabilities
- 🎯 **Modern UI/UX**: Responsive design with glass morphism effects
- ⚡ **Performance Optimized**: Webpack bundling with code splitting and caching
- 🔧 **Developer Friendly**: Hot reload, modern JavaScript, and comprehensive tooling

## Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Three.js** - 3D graphics and rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber

### Build Tools
- **Webpack 5** - Module bundler with advanced optimizations
- **Babel** - JavaScript compiler with modern preset
- **Workbox** - Service worker library for PWA features

### Deployment
- **Netlify** - Continuous deployment with serverless functions
- **PWA Compliant** - Manifest, service worker, and icon generation

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation

1. **Clone the repository**
   \\\ash
   git clone https://github.com/yourusername/shoe-customizer-pwa.git
   cd shoe-customizer-pwa
   \\\

2. **Install dependencies**
   \\\ash
   npm install
   \\\

3. **Start development server**
   \\\ash
   npm start
   \\\

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

- \
pm start\ - Start development server with hot reload
- \
pm run build\ - Build production bundle
- \
pm run dev\ - Start development server with hot module replacement
- \
pm run clean\ - Clean build directories
- \
pm run analyze\ - Analyze bundle size
- \
pm run deploy\ - Deploy to Netlify

## PWA Features

### Service Worker
- Caches critical assets for offline functionality
- Background sync for data updates
- Push notifications support

### Manifest
- Installable app experience
- Custom splash screen
- Themed status bar
- Shortcuts for quick actions

### Performance
- Code splitting for optimal loading
- Image optimization and lazy loading
- Aggressive caching strategies
- Preloading of critical resources

## Customization Options

### Shoe Properties
- **Colors**: Primary and secondary color customization
- **Materials**: Leather, canvas, synthetic options
- **Types**: Sneaker, boot, dress shoe, casual
- **Sizes**: Range from 6-13

### 3D Controls
- **Rotate**: Left click + drag
- **Zoom**: Mouse wheel or pinch
- **Pan**: Right click + drag

## Development

### Project Structure
\\\
src/
├── components/          # React components
│   ├── ShoeCustomizer.js    # Main 3D component
│   ├── ControlPanel.js      # Customization controls
│   └── LoadingSpinner.js    # Loading indicator
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles

public/
├── assets/
│   ├── icons/          # PWA icons
│   ├── models/         # 3D model files
│   ├── screenshots/    # PWA screenshots
│   └── textures/       # Material textures
├── manifest.json       # PWA manifest
└── index.html          # HTML template
\\\

### Adding New Features

1. **3D Models**: Add .glb/.gltf files to \public/assets/models/\
2. **Textures**: Add texture images to \public/assets/textures/\
3. **Components**: Create new React components in \src/components/\
4. **Utilities**: Add helper functions to \src/utils/\

## Deployment

### Netlify Deployment

1. **Connect repository to Netlify**
2. **Set build settings**:
   - Build command: \
pm run build\
   - Publish directory: \dist\
3. **Deploy automatically on push**

### Manual Deployment

\\\ash
npm run build
npm run deploy
\\\

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **PWA Score**: 100/100

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Three.js community for excellent 3D graphics tools
- React Three Fiber team for React integration
- Netlify for hosting and deployment platform
- Workbox team for PWA tooling

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React, Three.js, and modern web technologies.
