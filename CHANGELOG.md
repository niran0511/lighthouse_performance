# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-10

### Added
- Initial release of Lighthouse Monitor
- User authentication with JWT
- Lighthouse performance scanning
- URL validation with SSRF protection
- Performance metrics dashboard (FCP, LCP, TBT, CLS, Speed Index)
- Intelligent recommendation engine with severity levels
- Scan history and persistence
- Playwright automation for Horizon Broadband login
- Comprehensive test suite (Unit/API/E2E)
- Security middleware (Helmet, CORS, rate limiting)
- MongoDB integration with proper indexing
- Professional documentation

### Security
- SSRF protection blocks localhost, private IPs, and cloud metadata endpoints
- JWT-based authentication
- bcrypt password hashing
- Input validation and sanitization
- Rate limiting on API endpoints

### Fixed
- Chrome process cleanup on Windows
- Lighthouse scan timeout handling
- Proper error handling for failed scans

## [Unreleased]

### Planned
- Docker support
- Scan result caching
- Enhanced mobile responsiveness
- Scan statistics dashboard
- User preferences and settings
