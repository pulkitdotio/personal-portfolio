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

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/pulkitdotio",
    icon: "github",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pulkit-sharma-691909384?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: "linkedin",
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/pulkitdotdev",
    icon: "x",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:pulkit1865@gmail.com",
    icon: "email",
    external: false,
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
