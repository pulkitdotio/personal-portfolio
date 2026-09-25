import type { CSSProperties } from "react";
import { Braces, Code2, type LucideIcon } from "lucide-react";
import {
  siCss,
  siDocker,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siScikitlearn,
  siShadcnui,
  siSupabase,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import type { Technology, TechnologyIconName } from "../../data/portfolio";

type TechnologyChipProps = {
  technology: Technology;
};

const brandIcons: Partial<Record<TechnologyIconName, SimpleIcon>> = {
  typescript: siTypescript,
  javascript: siJavascript,
  python: siPython,
  java: siOpenjdk,
  html: siHtml5,
  css: siCss,
  react: siReact,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  shadcn: siShadcnui,
  nodejs: siNodedotjs,
  express: siExpress,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  redis: siRedis,
  supabase: siSupabase,
  tensorflow: siTensorflow,
  pandas: siPandas,
  "scikit-learn": siScikitlearn,
  git: siGit,
  github: siGithub,
  docker: siDocker,
  postman: siPostman,
  vercel: siVercel,
};

const utilityIcons: Partial<Record<TechnologyIconName, LucideIcon>> = {
  "rest-api": Braces,
  vscode: Code2,
};

function TechnologyIcon({ icon }: Pick<Technology, "icon">) {
  const brandIcon = brandIcons[icon];

  if (brandIcon) {
    return (
      <svg className="technology-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={brandIcon.path} fill="currentColor" />
      </svg>
    );
  }

  const UtilityIcon = utilityIcons[icon];
  return UtilityIcon ? <UtilityIcon className="technology-icon" aria-hidden="true" /> : null;
}

export function TechnologyChip({ technology }: TechnologyChipProps) {
  const style = {
    "--technology-color": technology.brandColor ?? "var(--color-accent)",
  } as CSSProperties;

  return (
    <li className="technology-chip" style={style}>
      <span className="technology-icon-shell">
        <TechnologyIcon icon={technology.icon} />
      </span>
      <span>{technology.name}</span>
    </li>
  );
}
