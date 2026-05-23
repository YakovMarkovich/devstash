import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── User ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      image: null,
      emailVerified: new Date(),
      isPro: false,
      // NextAuth requires a password field via an Account record;
      // we store the hash as a credentials account for later auth wiring.
    },
  });

  // Store hashed password as a credentials Account so NextAuth can verify it.
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "credentials",
        providerAccountId: user.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.id,
      access_token: passwordHash,
    },
  });

  // ── System Item Types ───────────────────────────────────────────────────
  const typeDefinitions = [
    { name: "snippet", icon: "Code", color: "#3b82f6" },
    { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
    { name: "command", icon: "Terminal", color: "#f97316" },
    { name: "note", icon: "StickyNote", color: "#fde047" },
    { name: "file", icon: "File", color: "#6b7280" },
    { name: "image", icon: "Image", color: "#ec4899" },
    { name: "link", icon: "Link", color: "#10b981" },
  ];

  const itemTypes: Record<string, string> = {};

  for (const def of typeDefinitions) {
    const existing = await prisma.itemType.findFirst({
      where: { name: def.name, userId: null, isSystem: true },
    });
    const type = existing ?? await prisma.itemType.create({
      data: {
        name: def.name,
        icon: def.icon,
        color: def.color,
        isSystem: true,
        userId: null,
      },
    });
    itemTypes[def.name] = type.id;
  }

  // ── Helper ──────────────────────────────────────────────────────────────
  async function createCollection(
    name: string,
    description: string,
    defaultTypeName: string,
    extra: { isFavorite?: boolean } = {}
  ) {
    const existing = await prisma.collection.findFirst({
      where: { name, userId: user.id },
    });
    if (existing) {
      return prisma.collection.update({
        where: { id: existing.id },
        data: { isFavorite: extra.isFavorite ?? false },
      });
    }
    return prisma.collection.create({
      data: {
        name,
        description,
        userId: user.id,
        defaultTypeId: itemTypes[defaultTypeName],
        isFavorite: extra.isFavorite ?? false,
      },
    });
  }

  async function createItem(
    title: string,
    typeName: string,
    content: string,
    extra: {
      description?: string;
      language?: string;
      url?: string;
      contentType?: "text" | "file";
      isPinned?: boolean;
      isFavorite?: boolean;
    } = {}
  ) {
    return prisma.item.create({
      data: {
        title,
        contentType: extra.contentType ?? "text",
        content: extra.url ? null : content,
        url: extra.url,
        description: extra.description,
        language: extra.language,
        isPinned: extra.isPinned ?? false,
        isFavorite: extra.isFavorite ?? false,
        userId: user.id,
        itemTypeId: itemTypes[typeName],
      },
    });
  }

  async function linkItemToCollection(itemId: string, collectionId: string) {
    await prisma.itemCollection.upsert({
      where: { itemId_collectionId: { itemId, collectionId } },
      update: {},
      create: { itemId, collectionId },
    });
  }

  // ── React Patterns ──────────────────────────────────────────────────────
  const reactPatterns = await createCollection(
    "React Patterns",
    "Reusable React patterns and hooks",
    "snippet",
    { isFavorite: true }
  );

  const hookSnippet = await createItem(
    "Custom Hooks",
    "snippet",
    `import { useState, useEffect, useCallback, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  return [storedValue, setValue] as const;
}

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}`,
    { description: "useDebounce, useLocalStorage, usePrevious hooks", language: "typescript", isPinned: true, isFavorite: true }
  );

  const componentSnippet = await createItem(
    "Component Patterns",
    "snippet",
    `import { createContext, useContext, ReactNode } from "react";

// Context provider pattern
function createCtx<T>() {
  const Ctx = createContext<T | undefined>(undefined);
  function useCtx() {
    const c = useContext(Ctx);
    if (!c) throw new Error("useCtx must be inside Provider");
    return c;
  }
  return [useCtx, Ctx.Provider] as const;
}

// Compound component pattern
interface TabsProps { children: ReactNode; defaultTab: string }
interface TabProps  { id: string; children: ReactNode }

const [useTabs, TabsProvider] = createCtx<{ activeTab: string; setActiveTab: (id: string) => void }>();

export function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return <TabsProvider value={{ activeTab, setActiveTab }}>{children}</TabsProvider>;
}

export function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{ fontWeight: activeTab === id ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
}`,
    { description: "Context provider factory and compound component pattern", language: "typescript" }
  );

  const utilSnippet = await createItem(
    "Utility Functions",
    "snippet",
    `// cn — merge Tailwind classes (clsx + tailwind-merge)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatDate
export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    typeof date === "string" ? new Date(date) : date
  );
}

// truncate
export function truncate(str: string, maxLength: number): string {
  return str.length <= maxLength ? str : str.slice(0, maxLength - 3) + "...";
}

// sleep
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));`,
    { description: "cn, formatDate, truncate, sleep helpers", language: "typescript" }
  );

  for (const item of [hookSnippet, componentSnippet, utilSnippet]) {
    await linkItemToCollection(item.id, reactPatterns.id);
  }

  // ── AI Workflows ────────────────────────────────────────────────────────
  const aiWorkflows = await createCollection(
    "AI Workflows",
    "AI prompts and workflow automations",
    "prompt",
    { isFavorite: true }
  );

  const codeReviewPrompt = await createItem(
    "Code Review Prompt",
    "prompt",
    `You are a senior software engineer conducting a thorough code review.

Review the following code and provide feedback on:
1. **Correctness** — does it handle edge cases and error states?
2. **Performance** — are there unnecessary re-renders, N+1 queries, or memory leaks?
3. **Security** — input validation, auth checks, injection risks?
4. **Readability** — naming, structure, unnecessary complexity?
5. **Patterns** — does it follow the conventions in this codebase?

Format your response as:
- 🔴 Must fix (blocking)
- 🟡 Should fix (non-blocking)
- 💡 Suggestion (optional improvement)

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    { description: "Structured code review prompt for AI assistants", isPinned: true }
  );

  const docGenPrompt = await createItem(
    "Documentation Generation",
    "prompt",
    `Generate comprehensive documentation for the following code.

Include:
- **Purpose** — what this code does and why it exists
- **Parameters / Props** — type, description, default value, required/optional
- **Return value** — what is returned and its shape
- **Usage examples** — at least 2 realistic examples
- **Edge cases** — known limitations or gotchas

Keep the tone technical but clear. Write for a developer who understands the domain but hasn't seen this code before.

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    { description: "Generates JSDoc-style docs with examples and edge cases" }
  );

  const refactorPrompt = await createItem(
    "Refactoring Assistance",
    "prompt",
    `Refactor the following code to improve quality without changing behavior.

Goals:
- Remove duplication (DRY)
- Improve naming clarity
- Reduce cognitive complexity (aim for cyclomatic complexity ≤ 5 per function)
- Extract reusable helpers where appropriate
- Preserve all existing functionality and public API

Constraints:
- Do NOT add new features
- Do NOT change function signatures unless strictly necessary
- Add a comment only if the WHY is non-obvious

Show the refactored code with a brief explanation of each change made.

\`\`\`
[PASTE CODE HERE]
\`\`\``,
    { description: "Targeted refactoring prompt that preserves behavior" }
  );

  for (const item of [codeReviewPrompt, docGenPrompt, refactorPrompt]) {
    await linkItemToCollection(item.id, aiWorkflows.id);
  }

  // ── DevOps ──────────────────────────────────────────────────────────────
  const devops = await createCollection(
    "DevOps",
    "Infrastructure and deployment resources",
    "snippet"
  );

  const dockerSnippet = await createItem(
    "Next.js Dockerfile",
    "snippet",
    `# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]`,
    { description: "Multi-stage Next.js Dockerfile with standalone output", language: "dockerfile" }
  );

  const deployCommand = await createItem(
    "Deploy to Production",
    "command",
    `#!/bin/bash
set -e

echo "▶ Building Docker image..."
docker build -t devstash:latest .

echo "▶ Pushing to registry..."
docker tag devstash:latest ghcr.io/$GITHUB_REPOSITORY/devstash:latest
docker push ghcr.io/$GITHUB_REPOSITORY/devstash:latest

echo "▶ Running migrations..."
npx prisma migrate deploy

echo "▶ Restarting service..."
docker compose -f docker-compose.prod.yml up -d --force-recreate

echo "✓ Deployment complete"`,
    { description: "Build, push, migrate, and restart production service", language: "bash" }
  );

  const dockerDocsLink = await createItem(
    "Docker Compose Docs",
    "link",
    "",
    { url: "https://docs.docker.com/compose/", description: "Official Docker Compose reference" }
  );

  const githubActionsLink = await createItem(
    "GitHub Actions Docs",
    "link",
    "",
    { url: "https://docs.github.com/en/actions", description: "GitHub Actions workflow documentation" }
  );

  for (const item of [dockerSnippet, deployCommand, dockerDocsLink, githubActionsLink]) {
    await linkItemToCollection(item.id, devops.id);
  }

  // ── Terminal Commands ───────────────────────────────────────────────────
  const terminalCommands = await createCollection(
    "Terminal Commands",
    "Useful shell commands for everyday development",
    "command"
  );

  const gitCommand = await createItem(
    "Git Operations",
    "command",
    `# Undo last commit but keep changes staged
git reset --soft HEAD~1

# Squash last N commits interactively
git rebase -i HEAD~N

# Clean up merged local branches
git branch --merged main | grep -v "^\\* main$" | xargs git branch -d

# Show log with graph
git log --oneline --graph --decorate --all

# Stash with a message
git stash push -m "WIP: feature description"

# Find the commit that introduced a bug
git bisect start && git bisect bad && git bisect good <sha>`,
    { description: "Common git operations: reset, rebase, branch cleanup, bisect", language: "bash" }
  );

  const dockerCommand = await createItem(
    "Docker Commands",
    "command",
    `# Remove all stopped containers, unused networks, dangling images
docker system prune -f

# Stop and remove all running containers
docker ps -q | xargs -r docker stop | xargs -r docker rm

# Follow logs for a service
docker compose logs -f <service>

# Open shell in running container
docker exec -it <container_id> sh

# Inspect container environment variables
docker inspect <container_id> | jq '.[0].Config.Env'

# Copy file from container to host
docker cp <container_id>:/path/in/container ./local-path`,
    { description: "Docker container management, logs, exec, and cleanup", language: "bash" }
  );

  const processCommand = await createItem(
    "Process Management",
    "command",
    `# Find process using a port (e.g. 3000)
lsof -ti :3000

# Kill process on a port
kill -9 $(lsof -ti :3000)

# Show top CPU/memory processes
ps aux --sort=-%cpu | head -15

# Monitor real-time resource usage
htop

# Run process in background and keep after logout
nohup npm run start > output.log 2>&1 &

# View running background jobs
jobs -l`,
    { description: "Port lookup, kill by port, background process management", language: "bash" }
  );

  const packageCommand = await createItem(
    "Package Manager Utilities",
    "command",
    `# Check for outdated packages
npm outdated

# Upgrade all packages to latest (respecting semver)
npx npm-check-updates -u && npm install

# Audit and auto-fix vulnerabilities
npm audit fix

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force

# Check which package provides a binary
npm which <binary-name>

# Install exact version (no caret/tilde)
npm install --save-exact <package>@<version>`,
    { description: "npm audit, outdated check, cache, global packages", language: "bash" }
  );

  for (const item of [gitCommand, dockerCommand, processCommand, packageCommand]) {
    await linkItemToCollection(item.id, terminalCommands.id);
  }

  // ── Design Resources ────────────────────────────────────────────────────
  const designResources = await createCollection(
    "Design Resources",
    "UI/UX resources and references",
    "link"
  );

  const tailwindLink = await createItem(
    "Tailwind CSS Docs",
    "link",
    "",
    { url: "https://tailwindcss.com/docs", description: "Official Tailwind CSS utility-first CSS framework documentation" }
  );

  const shadcnLink = await createItem(
    "shadcn/ui Components",
    "link",
    "",
    { url: "https://ui.shadcn.com/docs/components", description: "Re-usable components built with Radix UI and Tailwind CSS" }
  );

  const radixLink = await createItem(
    "Radix UI Design System",
    "link",
    "",
    { url: "https://www.radix-ui.com/themes/docs/overview/getting-started", description: "Unstyled, accessible component primitives for React" }
  );

  const lucideLink = await createItem(
    "Lucide Icons",
    "link",
    "",
    { url: "https://lucide.dev/icons/", description: "Beautiful & consistent icon library — search and copy SVG or React components" }
  );

  for (const item of [tailwindLink, shadcnLink, radixLink, lucideLink]) {
    await linkItemToCollection(item.id, designResources.id);
  }

  console.log("✓ Seed complete");
  console.log(`  User:        ${user.email}`);
  console.log(`  Item types:  ${Object.keys(itemTypes).length}`);
  console.log(`  Collections: React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
