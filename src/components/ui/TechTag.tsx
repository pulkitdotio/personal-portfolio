import type { ProjectTechnology } from "../../data/portfolio";

type TechTagProps = {
  technology: ProjectTechnology;
};

export function TechTag({ technology }: TechTagProps) {
  return <li className="tech-tag">{technology.label}</li>;
}
