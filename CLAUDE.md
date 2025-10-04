# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS TypeScript backend application. The project follows standard NestJS architecture with decorators, dependency injection, and modular structure.

## Development Commands

### Package Management
- Install dependencies: `yarn install`

### Running the Application
- Development with hot reload: `yarn run start:dev`
- Development: `yarn run start`
- Production: `yarn run start:prod`
- Debug mode: `yarn run start:debug`

### Building
- Build the project: `yarn run build`
- Build outputs to `dist/` directory

### Testing
- Unit tests: `yarn run test`
- Unit tests with watch: `yarn run test:watch`
- E2E tests: `yarn run test:e2e`
- Test coverage: `yarn run test:cov`
- Debug tests: `yarn run test:debug`

### Code Quality
- Linting: `yarn run lint`
- Code formatting: `yarn run format`

## Architecture

### Project Structure
- `src/` - Main application source code
  - `main.ts` - Application entry point, bootstraps NestJS app on port 3000 (or PORT env var)
  - `app.module.ts` - Root application module
  - `app.controller.ts` - Root controller with basic endpoints
  - `app.service.ts` - Root service with business logic
- `test/` - E2E tests
- `dist/` - Compiled JavaScript output

### Technology Stack
- **Framework**: NestJS 11.x
- **Language**: TypeScript with ES2023 target
- **Runtime**: Node.js
- **Package Manager**: Yarn
- **Testing**: Jest for unit tests, Supertest for E2E tests
- **Code Quality**: ESLint + Prettier with TypeScript ESLint rules

### TypeScript Configuration
- Uses `nodenext` module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict null checks enabled
- Source maps generated for debugging

### Testing Strategy
- Unit tests use Jest with ts-jest transformer
- E2E tests in `test/` directory using separate Jest config
- Tests follow `.spec.ts` pattern for unit tests, `.e2e-spec.ts` for E2E tests

## Development Notes

- Application starts on port 3000 by default (configurable via PORT environment variable)
- Uses NestJS's standard decorator-based architecture
- ESLint configured with TypeScript and Prettier integration
- Some TypeScript strict rules relaxed (`noImplicitAny: false`)