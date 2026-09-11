# Contributing to Lighthouse Monitor

Thank you for your interest in contributing to Lighthouse Monitor!

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB locally
5. Run `npm run dev` to start both client and server

## Code Standards

### Commit Messages

Follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` adding or updating tests
- `refactor:` code refactoring
- `chore:` maintenance tasks

### Code Style

- Use ESLint configuration provided
- Format code before committing
- Write meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### Testing

- Write unit tests for utilities and services
- Add API tests for new endpoints
- Include E2E tests for critical user flows
- Run `npm test` before committing
- Run `npm run test:e2e` for browser tests

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Add tests for new functionality
4. Update documentation as needed
5. Ensure all tests pass
6. Submit PR with description of changes

## Security

- Never commit credentials or secrets
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security issues privately

## Questions?

Open an issue or contact the maintainers.
