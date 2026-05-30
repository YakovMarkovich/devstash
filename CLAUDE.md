# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standarts.md
- @context/ai-interaction.md
- @context/current-feature.md

## Commands

```bash
npm run dev      # start dev server (Turbopack, http://localhost:3000)
npm run build    # production build (Turbopack)
npm run start    # serve production build
npm run lint     # ESLint via the eslint CLI (not `next lint`)
```

## Neon Database

- **Always** use project ID `super-base-55835807` for all Neon MCP tool calls.
- **Always** use branch ID `br-wild-queen-apyl4fkl` (the development branch) unless I explicitly say "production" or specify a different branch.
- **Never** query or modify the production branch (`br-proud-leaf-ap2egegy`) without explicit instruction.
- When in doubt, ask before targeting any branch other than dev.
