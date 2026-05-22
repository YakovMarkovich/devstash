export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "demo@devstash.io",
  image: null,
  isPro: false,
};

export const mockItemTypes = [
  {
    id: "type_snippet",
    name: "Snippet",
    icon: "Code",
    color: "#3b82f6",
    isSystem: true,
  },
  {
    id: "type_prompt",
    name: "Prompt",
    icon: "Sparkles",
    color: "#8b5cf6",
    isSystem: true,
  },
  {
    id: "type_command",
    name: "Command",
    icon: "Terminal",
    color: "#f97316",
    isSystem: true,
  },
  {
    id: "type_note",
    name: "Note",
    icon: "StickyNote",
    color: "#fde047",
    isSystem: true,
  },
  {
    id: "type_link",
    name: "Link",
    icon: "Link",
    color: "#10b981",
    isSystem: true,
  },
  {
    id: "type_file",
    name: "File",
    icon: "File",
    color: "#6b7280",
    isSystem: true,
  },
  {
    id: "type_image",
    name: "Image",
    icon: "Image",
    color: "#ec4899",
    isSystem: true,
  },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    defaultTypeId: "type_snippet",
    itemCount: 12,
    userId: "user_1",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-05-15"),
  },
  {
    id: "col_2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    defaultTypeId: "type_snippet",
    itemCount: 8,
    userId: "user_1",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-05-10"),
  },
  {
    id: "col_3",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    defaultTypeId: "type_file",
    itemCount: 5,
    userId: "user_1",
    createdAt: new Date("2026-02-14"),
    updatedAt: new Date("2026-05-20"),
  },
  {
    id: "col_4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    defaultTypeId: "type_note",
    itemCount: 24,
    userId: "user_1",
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-05-18"),
  },
  {
    id: "col_5",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    defaultTypeId: "type_command",
    itemCount: 15,
    userId: "user_1",
    createdAt: new Date("2026-03-10"),
    updatedAt: new Date("2026-05-12"),
  },
  {
    id: "col_6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    defaultTypeId: "type_prompt",
    itemCount: 18,
    userId: "user_1",
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-05-21"),
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "useAuth Hook",
    contentType: "text" as const,
    content: `import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}`,
    description: "Custom authentication hook for React applications",
    isFavorite: true,
    isPinned: true,
    language: "typescript",
    itemTypeId: "type_snippet",
    tags: ["react", "auth", "hooks"],
    userId: "user_1",
    createdAt: new Date("2026-05-15"),
    updatedAt: new Date("2026-05-15"),
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    contentType: "text" as const,
    content: `async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2 ** i * 1000));
    }
  }
  throw new Error("Unreachable");
}`,
    description: "Fetch wrapper with exponential backoff retry logic",
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    itemTypeId: "type_snippet",
    tags: ["api", "error-handling", "fetch"],
    userId: "user_1",
    createdAt: new Date("2026-05-12"),
    updatedAt: new Date("2026-05-12"),
  },
  {
    id: "item_3",
    title: "Git Rebase Workflow",
    contentType: "text" as const,
    content: `# Interactive rebase last N commits
git rebase -i HEAD~3

# Rebase onto main
git fetch origin
git rebase origin/main

# Abort if conflicts
git rebase --abort`,
    description: "Common git rebase commands for clean history",
    isFavorite: false,
    isPinned: false,
    language: "bash",
    itemTypeId: "type_command",
    tags: ["git", "rebase"],
    userId: "user_1",
    createdAt: new Date("2026-05-10"),
    updatedAt: new Date("2026-05-10"),
  },
  {
    id: "item_4",
    title: "Code Review Prompt",
    contentType: "text" as const,
    content: `Review the following code for:
1. Security vulnerabilities
2. Performance issues
3. Edge cases not handled
4. Adherence to SOLID principles

Code:
\`\`\`
{{code}}
\`\`\`

Provide specific, actionable feedback with line references.`,
    description: "Structured prompt for AI code reviews",
    isFavorite: true,
    isPinned: false,
    language: null,
    itemTypeId: "type_prompt",
    tags: ["code-review", "ai"],
    userId: "user_1",
    createdAt: new Date("2026-05-08"),
    updatedAt: new Date("2026-05-08"),
  },
  {
    id: "item_5",
    title: "Tailwind Dark Mode Setup",
    contentType: "text" as const,
    content: `// tailwind.config.ts
export default {
  darkMode: "class",
  // ...
};

// Root layout
<html className="dark">`,
    description: "Configure Tailwind CSS dark mode with class strategy",
    isFavorite: false,
    isPinned: false,
    language: "typescript",
    itemTypeId: "type_snippet",
    tags: ["tailwind", "dark-mode"],
    userId: "user_1",
    createdAt: new Date("2026-05-05"),
    updatedAt: new Date("2026-05-05"),
  },
  {
    id: "item_6",
    title: "Docker Compose Dev Stack",
    contentType: "text" as const,
    content: `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"`,
    description: "Local dev stack with Postgres and Redis",
    isFavorite: false,
    isPinned: false,
    language: "yaml",
    itemTypeId: "type_command",
    tags: ["docker", "postgres", "redis"],
    userId: "user_1",
    createdAt: new Date("2026-05-03"),
    updatedAt: new Date("2026-05-03"),
  },
];

export const mockItemCounts = {
  snippets: 24,
  prompts: 18,
  commands: 15,
  notes: 12,
  files: 5,
  images: 3,
  links: 8,
};
