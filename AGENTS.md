# Agent Guidelines for PND Developers Project

## Overview
This repository contains a full-stack real estate management application with:
- **Client**: React 18 + Vite + React Router + Framer Motion
- **Server**: Node.js + Express + SQLite3
- **Styling**: Tailwind CSS + custom CSS

## Development Commands

### Client (React/Vite)
```bash
# Start development server
npm run dev          # Runs client on http://localhost:5173

# Build for production
npm run build        # Outputs to client/dist/

# Preview production build
npm run preview
```

### Server (Node/Express)
```bash
# Start development server
npm start            # Runs server on http://localhost:3001

# Seed database
npm run seed         # Populates db/pnd.db with initial data
```

### Concurrent Development
For full-stack development, run both client and server simultaneously:
```bash
# Terminal 1: Client
cd client && npm run dev

# Terminal 2: Server  
cd server && npm start
```

## Code Style Guidelines

### JavaScript/React Standards
- **File Extensions**: `.jsx` for React components, `.js` for plain JavaScript
- **Imports**: 
  - Group imports: React → Third-party → Internal (components/hooks) → Styles
  - Use named imports for React hooks: `import { useState, useEffect } from 'react'`
  - Default imports for components: `import Component from './Component'`
- **Naming Conventions**:
  - Components: PascalCase (e.g., `LayoutEditor`)
  - Functions/variables: camelCase (e.g., `handleSave`, `formData`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_PLOTS`)
  - Files: PascalCase for components (`Component.jsx`), camelCase for utilities (`util.js`)
- **React Specific**:
  - Use functional components with hooks
  - Prefer `useCallback` and `useMemo` for performance optimization
  - Fragment shorthand `<>...</>` when no key is needed
  - Always include `key` prop in list items
  - Use TypeScript PropTypes or migrate to TypeScript for complex props

### Styling (Tailwind CSS)
- **Utility Classes**: 
  - Follow mobile-first approach (small to large breakpoints)
  - Group related utilities: positioning → sizing → spacing → typography → visual
  - Use `@apply` sparingly for component-specific styles
- **Color System**: 
  - Use semantic names from Tailwind config (`text-text-light`, `bg-bg-dark`)
  - Custom colors defined in `tailwind.config.js`
- **Responsive Design**:
  - Use `md:` prefix for medium breakpoint (≥768px)
  - Use `lg:` for large breakpoint (≥1024px)
  - Hide/show elements with `hidden md:block` patterns

### Error Handling
- **Client-Side**:
  - Use try/catch for async operations
  - Display user-friendly error messages via toast notifications
  - Validate form inputs before submission
  - Handle loading states with skeleton loaders
- **Server-Side**:
  - Use Express async error handling wrapper
  - Return appropriate HTTP status codes (400, 404, 500)
  - Log errors with context for debugging
  - Validate request data with schemas (Joi/Zod)

### State Management
- **Client State**:
  - Use React hooks (`useState`, `useEffect`) for local component state
  - Custom hooks for reusable logic (see `src/hooks/`)
  - Avoid prop drilling - consider Context API for global state
  - Normalize API response data before storing in state
- **Server State**:
  - Database transactions for related operations
  - Connection pooling for SQLite (consider upgrading for production)
  - Cache frequently accessed data when appropriate

### File Organization
```
client/
├── src/
│   ├── api/          # API service functions
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page-level components
│   │   ├── agent/    # Agent/dashboard pages
│   │   └── public/   # Public-facing pages
│   └── App.jsx       # Main app component
server/
├── db/               # Database schema and seed files
├── middleware/       # Custom Express middleware
├── routes/           # API route handlers
└── server.js         # Express app entry point
```

## Current Project Issues

### Missing Configurations
1. **No ESLint/Prettier Configuration**: Code formatting must be manually enforced
2. **No Test Suite**: Zero test files found in the project
3. **No TypeScript Migration**: Despite TS config in devDependencies, files use .jsx extension
4. **Inconsistent Import Formatting**: Some files show malformed imports (see temp_create.js)

### Recommendations
1. Add ESLint and Prettier configurations with React/Tailwind presets
2. Implement testing strategy with Vitest/Jest and React Testing Library
3. Consider migrating to TypeScript for improved type safety
4. Add linting scripts to package.json (`lint`, `format`, `test`)
5. Implement proper error boundaries in React components
6. Add API request/response validation
7. Create documentation for component props and hooks

## Immediate Next Steps for Agents
1. When creating/modifying files, follow existing import patterns
2. Maintain consistency with Tailwind utility class ordering
3. Add proper error handling and loading states to new components
4. Write unit tests for any new business logic
5. Ensure accessibility compliance (aria-labels, semantic HTML, keyboard navigation)