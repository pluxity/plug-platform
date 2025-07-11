# Plug Platform v1.0

> Modern WebRTC-based platform built with React 19, TypeScript, and Vite

## 🚀 Features

- **WebRTC Integration**: Real-time communication capabilities
- **Modern React 19**: Latest React features with TypeScript
- **Vite**: Lightning-fast development and build experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **ESLint**: Code quality and consistency
- **TypeScript**: Type safety and better development experience

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm main dev

# Build for production
pnpm main build

# Run linting
pnpm main lint

# Fix linting issues
pnpm main lint:fix
```

## 📁 Project Structure

```
apps/main/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎯 Scripts

- `pnpm main dev` - Start development server
- `pnpm main build` - Build for production  
- `pnpm main preview` - Preview production build
- `pnpm main lint` - Run ESLint
- `pnpm main lint:fix` - Fix ESLint issues

## 🔧 Configuration

### Vite Configuration
- Hot Module Replacement (HMR)
- Path aliases (@/ for src/)
- TypeScript support
- React plugin

### Tailwind CSS
- Custom color palette
- Responsive design utilities
- Dark mode support

### TypeScript
- Strict type checking
- Path mapping
- Modern ES features

## 🚦 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `pnpm install`
3. **Start development**: `pnpm main dev`
4. **Open your browser**: `http://localhost:3000`

## 📦 Available Packages

This project uses the following workspace packages:

- `@plug/ui` - UI component library
- `@plug/api-hooks` - API integration hooks
- `@plug/common-services` - Shared services
- `@plug/engine` - Core engine functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.
