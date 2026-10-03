import ledgerPreview480 from "../assets/projects/ledger-preview-480.webp";
import preprolePreview480 from "../assets/projects/preprole-preview-480.webp";
import sentinelPreview480 from "../assets/projects/sentinel-preview-480.webp";
import ledgerPreview from "../assets/projects/ledger-preview-1672.webp";
import ledgerPreview960 from "../assets/projects/ledger-preview-960.webp";
import preprolePreview from "../assets/projects/preprole-preview-1672.webp";
import preprolePreview960 from "../assets/projects/preprole-preview-960.webp";
import sentinelPreview from "../assets/projects/sentinel-preview-1672.webp";
import sentinelPreview960 from "../assets/projects/sentinel-preview-960.webp";

type SocialIconName = "resume" | "github" | "linkedin" | "x" | "email";

interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconName;
  external: boolean;
}

export interface ProjectTechnology {
  label: string;
}

type ProjectActionKind = "github" | "live";

interface ProjectAction {
  label: "GitHub" | "Live";
  href: string;
  kind: ProjectActionKind;
}

export interface ProjectMedia {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width: number;
  height: number;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export interface Project {
  featured?: boolean;
  category: string;
  accent: string;
  title: string;
  description: string;
  technologies: ProjectTechnology[];
  actions: ProjectAction[];
  media?: ProjectMedia;
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

const projectPreviewSizes =
  "(max-width: 767px) calc(100vw - 64px), (max-width: 1199px) 50vw, 620px";

// Supplied reference value, not a live analytics count. Replace it here when available.
export const profileViews = { displayValue: "124K" };

export const socialLinks: SocialLink[] = [
  {
    label: "Resume",
    href: "https://drive.google.com/file/d/1f89FRbq-PSpkwBNlixifQbkNn7qXzy-X/view?usp=drivesdk",
    icon: "resume",
    external: true,
  },
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
    featured: true,
    category: "OBSERVABILITY / FULL STACK",
    accent: "#69a88e",
    media: {
      src: sentinelPreview,
      srcSet: `${sentinelPreview480} 480w, ${sentinelPreview960} 960w, ${sentinelPreview} 1672w`,
      sizes: projectPreviewSizes,
      alt: "Sentinel API monitoring interface preview",
      width: 1672,
      height: 941,
    },
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
        label: "Live",
        href: "https://sentinel-jet-one.vercel.app",
        kind: "live",
      },
      {
        label: "GitHub",
        href: "https://github.com/pulkitdotio/Sentinel",
        kind: "github",
      },
    ],
  },
  {
    title: "PrepRole AI",
    category: "AI / FULL STACK",
    accent: "#8d93cb",
    media: {
      src: preprolePreview,
      srcSet: `${preprolePreview480} 480w, ${preprolePreview960} 960w, ${preprolePreview} 1672w`,
      sizes: projectPreviewSizes,
      alt: "PrepRole AI interview preparation dashboard preview",
      width: 1672,
      height: 941,
    },
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
        label: "Live",
        href: "https://prep-role-ai.vercel.app",
        kind: "live",
      },
      {
        label: "GitHub",
        href: "https://github.com/pulkitdotio/PrepRole_AI",
        kind: "github",
      },
    ],
  },
  {
    title: "ledger-api",
    category: "BACKEND / FINTECH",
    accent: "#82a7b4",
    media: {
      src: ledgerPreview,
      srcSet: `${ledgerPreview480} 480w, ${ledgerPreview960} 960w, ${ledgerPreview} 1672w`,
      sizes: projectPreviewSizes,
      alt: "ledger-api backend ledger system preview",
      width: 1672,
      height: 941,
    },
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
  },
];

export const technologies: Technology[] = [
  { name: "TypeScript", icon: "typescript", brandColor: "#3178c6" },
  { name: "JavaScript", icon: "javascript", brandColor: "#f7df1e" },
  { name: "Python", icon: "python", brandColor: "#3776ab" },
  { name: "Java", icon: "java", brandColor: "#f89820" },
  { name: "HTML", icon: "html", brandColor: "#e34f26" },
  { name: "CSS", icon: "css", brandColor: "#663399" },
  { name: "React.js", icon: "react", brandColor: "#61dafb" },
  { name: "Next.js", icon: "nextjs", brandColor: "#f5f5f5" },
  { name: "Tailwind CSS", icon: "tailwind", brandColor: "#06b6d4" },
  { name: "shadcn/ui", icon: "shadcn", brandColor: "#f5f5f5" },
  { name: "Node.js", icon: "nodejs", brandColor: "#5fa04e" },
  { name: "Express.js", icon: "express", brandColor: "#f5f5f5" },
  { name: "REST APIs", icon: "rest-api", brandColor: "#a1a1aa" },
  { name: "PostgreSQL", icon: "postgresql", brandColor: "#4169e1" },
  { name: "MongoDB", icon: "mongodb", brandColor: "#47a248" },
  { name: "Redis", icon: "redis", brandColor: "#ff4438" },
  { name: "Supabase", icon: "supabase", brandColor: "#3fcf8e" },
  { name: "TensorFlow", icon: "tensorflow", brandColor: "#ff6f00" },
  { name: "Pandas", icon: "pandas", brandColor: "#e70488" },
  { name: "scikit-learn", icon: "scikit-learn", brandColor: "#f7931e" },
  { name: "Git", icon: "git", brandColor: "#f05032" },
  { name: "GitHub", icon: "github", brandColor: "#f5f5f5" },
  { name: "Docker", icon: "docker", brandColor: "#2496ed" },
  { name: "Postman", icon: "postman", brandColor: "#ff6c37" },
  { name: "VS Code", icon: "vscode", brandColor: "#007acc" },
  { name: "Vercel", icon: "vercel", brandColor: "#f5f5f5" },
];
export const heroRoles = ["Full Stack Developer", "AI/ML Enthusiast"] as const;
export const technologyGroups: {
  title: string;
  icons: TechnologyIconName[];
}[] = [
  {
    title: "Frontend",
    icons: [
      "typescript",
      "javascript",
      "html",
      "css",
      "react",
      "nextjs",
      "tailwind",
      "shadcn",
    ],
  },
  {
    title: "Backend & Data",
    icons: [
      "nodejs",
      "express",
      "rest-api",
      "java",
      "postgresql",
      "mongodb",
      "redis",
      "supabase",
    ],
  },
  {
    title: "AI/ML",
    icons: ["python", "tensorflow", "pandas", "scikit-learn"],
  },
  {
    title: "Tools & Workflow",
    icons: ["git", "github", "docker", "postman", "vscode", "vercel"],
  },
];
