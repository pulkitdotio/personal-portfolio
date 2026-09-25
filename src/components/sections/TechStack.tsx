import { technologyGroups } from "../../data/portfolio";
import { Container } from "../layout/Container";
import { TechnologyChip } from "../ui/TechnologyChip";

export function TechStack() {
  return (
    <Container as="section" id="stack" className="stack-section" aria-labelledby="stack-title">
      <div className="section-heading stack-heading">
        <div>
          <p className="section-kicker">Stack / 03</p>
          <h2 id="stack-title">Tech Stack</h2>
        </div>
        <p>Technologies I use to build reliable products from interface to infrastructure.</p>
      </div>

      <ul className="stack-groups">
        {technologyGroups.map((group) => (
          <li className="stack-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="technology-list" aria-label={`${group.title} technologies`}>
              {group.technologies.map((technology) => (
                <TechnologyChip key={technology.name} technology={technology} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Container>
  );
}
