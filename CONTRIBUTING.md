# Contributing to Ash2 Fitness

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the Gym Management System.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Include a clear title and description
3. Provide steps to reproduce
4. Include screenshots/error logs if applicable
5. Specify your environment (OS, browser, Node version)

### Suggesting Features

1. Check the roadmap in README.md
2. Provide clear use case
3. Explain the benefit
4. Link to related issues if any

### Pull Requests

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Make your changes
4. Add tests for new functionality
5. Ensure linting passes: `npm run lint`
6. Commit with clear messages: `git commit -m 'Add AmazingFeature'`
7. Push to branch: `git push origin feature/AmazingFeature`
8. Open Pull Request with description

## Development Setup

```bash
git clone https://github.com/sharonaaas27-dev/Gym-Management-System.git
cd Gym-Management-System

# Install dependencies
cd server && npm install
cd ../client && npm install

# Setup environment
cp .env.example .env

# Run development
cd ../server && npm run dev &
cd ../client && npm run dev
```

## Coding Standards

- Use TypeScript with strict mode
- Follow ESLint configuration
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features

## Commit Messages

```
Fix: Brief description (50 chars)
Add: Brief description (50 chars)
Refactor: Brief description (50 chars)
Docs: Brief description (50 chars)
Test: Brief description (50 chars)
```

## Questions?

Feel free to open an issue or contact me at sharon@email.com

Thank you for contributing! 🚀