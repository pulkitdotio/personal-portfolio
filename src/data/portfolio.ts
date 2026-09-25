export type SocialIconName = "github" | "linkedin" | "x" | "email";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
  external: boolean;
}

export interface ProjectTechnology {
  label: string;
}

export type ProjectActionKind = "github" | "live";

export interface ProjectAction {
  label: "GitHub" | "Live";
  href: string;
  kind: ProjectActionKind;
}

export type ProjectVisualKind = "sentinel" | "preprole" | "ledger";

export interface Project {
  title: string;
  description: string;
  technologies: ProjectTechnology[];
  actions: ProjectAction[];
  visual: ProjectVisualKind;
  featured?: boolean;
  engineeringHighlight?: string;
}

export type TechnologyIconName =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "html"
  | "css"
  | "react"
  | "nextjs"
  | "tailwind"
  | "shadcn"
  | "nodejs"
  | "express"
  | "rest-api"
  | "postgresql"
  | "mongodb"
  | "redis"
  | "supabase"
  | "tensorflow"
  | "pandas"
  | "scikit-learn"
  | "git"
  | "github"
  | "docker"
  | "postman"
  | "vscode"
  | "vercel";

export interface Technology {
  name: string;
  icon: TechnologyIconName;
  brandColor?: string;
}

export interface TechnologyGroup {
  title: string;
  technologies: Technology[];
}

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/pulkitdotio",
    icon: "github",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:pulkit1865@gmail.com",
    icon: "email",
    external: false,
  },
  {
    label: "Twitter",
    href: "https://x.com/pulkitdotdev",
    icon: "x",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pulkit-sharma-691909384?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: "linkedin",
    external: true,
  },
];

export const projects: Project[] = [
  {
    title: "Sentinel",
    description:
      "Distributed API monitoring platform with multi-region health checks, automated incident detection, real-time dashboard updates, and latency analytics.",
    engineeringHighlight:
      "Health and incident decisions remain deterministic; optional AI analysis runs asynchronously instead of controlling monitor state.",
    technologies: [
      { label: "TypeScript" },
      { label: "React" },
      { label: "Node.js" },
      { label: "Redis" },
      { label: "MongoDB" },
      { label: "Socket.IO" },
    ],
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/pulkitdotio/Sentinel",
        kind: "github",
      },
      {
        label: "Live",
        href: "https://sentinel-jet-one.vercel.app",
        kind: "live",
      },
    ],
    visual: "sentinel",
    featured: true,
  },
  {
    title: "PrepRole AI",
    description:
      "AI-powered interview preparation platform that compares a candidate profile with a target role to generate personalized questions, skill-gap insights, preparation guidance, and tailored resume support.",
    technologies: [
      { label: "React" },
      { label: "Node.js" },
      { label: "Express" },
      { label: "MongoDB" },
      { label: "Gemini" },
    ],
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/pulkitdotio/PrepRole_AI",
        kind: "github",
      },
      {
        label: "Live",
        href: "https://prep-role-ai.vercel.app",
        kind: "live",
      },
    ],
    visual: "preprole",
  },
  {
    title: "ledger-api",
    description:
      "Backend financial ledger demonstrating immutable double-entry records, atomic transfers, idempotent requests, and JWT-based authentication.",
    technologies: [
      { label: "JavaScript" },
      { label: "Node.js" },
      { label: "REST API" },
      { label: "MongoDB" },
      { label: "JWT" },
      { label: "Transactions" },
    ],
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/pulkitdotio/ledger-api",
        kind: "github",
      },
    ],
    visual: "ledger",
  },
];

export const technologyGroups: TechnologyGroup[] = [
  {
    title: "Languages",
    technologies: [
      { name: "TypeScript", icon: "typescript", brandColor: "#3178c6" },
      { name: "JavaScript", icon: "javascript", brandColor: "#f7df1e" },
      { name: "Python", icon: "python", brandColor: "#4584b6" },
      { name: "Java", icon: "java", brandColor: "#e76f00" },
      { name: "HTML", icon: "html", brandColor: "#e34f26" },
      { name: "CSS", icon: "css", brandColor: "#8b72d8" },
    ],
  },
  {
    title: "Frontend",
    technologies: [
      { name: "React.js", icon: "react", brandColor: "#61dafb" },
      { name: "Next.js", icon: "nextjs", brandColor: "#f5f5f5" },
      { name: "Tailwind CSS", icon: "tailwind", brandColor: "#06b6d4" },
      { name: "shadcn/ui", icon: "shadcn", brandColor: "#f5f5f5" },
    ],
  },
  {
    title: "Backend",
    technologies: [
      { name: "Node.js", icon: "nodejs", brandColor: "#5fa04e" },
      { name: "Express.js", icon: "express", brandColor: "#f5f5f5" },
      { name: "REST APIs", icon: "rest-api", brandColor: "#8791ff" },
    ],
  },
  {
    title: "Databases / Infrastructure",
    technologies: [
      { name: "PostgreSQL", icon: "postgresql", brandColor: "#5b8fd4" },
      { name: "MongoDB", icon: "mongodb", brandColor: "#47a248" },
      { name: "Redis", icon: "redis", brandColor: "#ff4438" },
      { name: "Supabase", icon: "supabase", brandColor: "#3fcf8e" },
    ],
  },
  {
    title: "AI / ML",
    technologies: [
      { name: "TensorFlow", icon: "tensorflow", brandColor: "#ff6f00" },
      { name: "Pandas", icon: "pandas", brandColor: "#e70488" },
      { name: "scikit-learn", icon: "scikit-learn", brandColor: "#f7931e" },
    ],
  },
  {
    title: "Tools",
    technologies: [
      { name: "Git", icon: "git", brandColor: "#f05032" },
      { name: "GitHub", icon: "github", brandColor: "#f5f5f5" },
      { name: "Docker", icon: "docker", brandColor: "#2496ed" },
      { name: "Postman", icon: "postman", brandColor: "#ff6c37" },
      { name: "VS Code", icon: "vscode", brandColor: "#23a8f2" },
      { name: "Vercel", icon: "vercel", brandColor: "#f5f5f5" },
    ],
  },
];
