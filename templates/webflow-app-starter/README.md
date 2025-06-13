# PixelMakers Webflow Designer Extension

This template provides a modern setup for building Webflow Designer Extensions using React, TypeScript, and Vite. Designer Extensions are powerful single-page applications that run within the Webflow interface, allowing you to enhance and extend the Webflow design experience.

## Features

- ⚡️ [Vite](https://vitejs.dev/) for lightning-fast development and building
- ⚛️ [React](https://reactjs.org/) for building the user interface
- 📦 [TypeScript](https://www.typescriptlang.org/) for type safety
- 🎨 [Tailwind CSS](https://tailwindcss.com/) for styling
- 🔍 [ESLint](https://eslint.org/) for code linting
- 💅 [Prettier](https://prettier.io/) for code formatting

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and Webflow API integrations
│   ├── styles/        # Global styles and Tailwind configuration
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── vite.config.ts     # Vite configuration
```

## Webflow Designer API

This project uses the Webflow Designer APIs to interact with the Webflow interface. Key features include:

- Creating and managing elements and components on the canvas
- Defining and modifying styles and variables
- Handling asset management
- Structuring site architecture with pages and folders

For more information about the Designer APIs, visit the [official documentation](https://developers.webflow.com/data/docs/designer-extensions).

## Development Guidelines

1. **Type Safety**: This project uses TypeScript for enhanced type safety. Make sure to properly type your components and functions.

2. **Styling**: We use Tailwind CSS for styling. Follow the utility-first approach and maintain consistency in design.

3. **Code Quality**: 
   - Follow the ESLint configuration for code quality
   - Use Prettier for consistent code formatting
   - Write meaningful component and function names
   - Add comments for complex logic

4. **Performance**: 
   - Keep bundle size in mind
   - Optimize images and assets
   - Use React.memo() for expensive components
   - Implement proper code splitting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
