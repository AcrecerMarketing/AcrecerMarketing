# CLAUDE.md — AI Assistant Guide for AcrecerMarketing

## Repository Overview

This is a **GitHub profile repository** for the user `AcrecerMarketing`. GitHub treats a repository named identically to the username as a special profile repository — its `README.md` content is displayed publicly on the user's GitHub profile page at `github.com/AcrecerMarketing`.

**Repository:** `AcrecerMarketing/AcrecerMarketing`
**Type:** GitHub profile page
**Primary file:** `README.md` (rendered on GitHub profile)

---

## Current State (as of 2026-03-14)

The repository contains two files:

| File | Purpose |
|------|---------|
| `README.md` | GitHub profile display page |
| `CLAUDE.md` | This file — AI assistant guide |

There is no application code, no dependencies, no build system, and no test suite.

---

## Repository Contents

### README.md

The profile README introduces the owner:
- **Interests:** Digital Marketing, marketing-focused software development
- **Currently learning:** Kotlin
- **Looking to collaborate on:** Android development
- **Contact:** mmarcher85@gmail.com

---

## Git Workflow

### Branches
- `main` — default branch on remote (`origin/main`)
- `master` — local default branch
- `claude/*` — branches used by AI assistant sessions

### Commit Style
- Single commit history: `2333afe Create README.md` (Nov 12, 2021)
- Use short, descriptive commit messages in imperative mood (e.g., "Update README with new skills")

### Push Instructions
```bash
git push -u origin <branch-name>
```
Branches for AI sessions must follow the pattern: `claude/<description>-<session-id>`

---

## Development Guidelines for AI Assistants

### What this repo is for
This is a personal profile repository. Changes here affect what visitors see on the GitHub profile. Treat edits to `README.md` with care — keep content accurate and representative of the owner.

### README.md conventions
- Written in standard GitHub-flavored Markdown
- Uses emoji bullet points for visual appeal (acceptable here since it's a profile page)
- Keep it concise — profile READMEs are meant to be scanned quickly

### Adding new content
If this repository grows into a real project:
1. Add a `package.json` / `requirements.txt` / equivalent before writing code
2. Set up a `.gitignore` appropriate for the technology stack
3. Update this `CLAUDE.md` to reflect the new structure, stack, and workflows
4. Add tests before or alongside new features

### What NOT to do
- Do not push to `main` directly without a pull request
- Do not add generated files, build artifacts, or `node_modules`
- Do not commit secrets or credentials

---

## Extending This Repository

If this repository is expanded into a marketing software project (consistent with the owner's stated interests), the likely tech stack would be:

- **Language:** Kotlin (currently learning) or JavaScript/TypeScript
- **Platform:** Android (stated collaboration interest) or web
- **Domain:** Digital marketing tooling

When that happens, update this file with:
- Build commands
- Test commands
- Environment variable requirements
- Deployment steps
