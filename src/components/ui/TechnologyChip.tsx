import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import Braces from "lucide-react/dist/esm/icons/braces.mjs";
import Code2 from "lucide-react/dist/esm/icons/code-2.mjs";
import type { Technology, TechnologyIconName } from "../../data/portfolio";
import { brandIconPaths } from "../../data/simpleIconPaths";

type TechnologyChipProps = {
  technology: Technology;
};

const utilityIcons: Partial<Record<TechnologyIconName, LucideIcon>> = {
  "rest-api": Braces,
  vscode: Code2,
};

function TechnologyIcon({ icon }: Pick<Technology, "icon">) {
  const brandIconPath = brandIconPaths[icon];

  if (brandIconPath) {
    return (
      <svg
        className="technology-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path d={brandIconPath} fill="currentColor" />
      </svg>
    );
  }

  const UtilityIcon = utilityIcons[icon];
  return UtilityIcon ? (
    <UtilityIcon className="technology-icon" aria-hidden="true" />
  ) : null;
}

export function TechnologyChip({ technology }: TechnologyChipProps) {
  const style = {
    "--technology-color": technology.brandColor ?? "var(--color-accent)",
  } as CSSProperties;

  return (
    <li className="technology-chip" style={style}>
      <TechnologyIcon icon={technology.icon} />
      <span>{technology.name}</span>
    </li>
  );
}
