import { technologies, technologyGroups } from "../../data/portfolio";
import { timings } from "../../lib/motion";
import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { TechnologyChip } from "../ui/TechnologyChip";
export function TechStack() {
  return (
    <Container
      as="section"
      id="stack"
      className="section stack-section"
      aria-labelledby="stack-title"
    >
      <SectionHeading title="Tech Stack" id="stack-title" />
      <div className="stack-groups">
        {technologyGroups.map((group, index) => (
          <Reveal
            className="stack-group"
            key={group.title}
            delay={(index % 2) * timings.stagger}
          >
            <div className="stack-group-heading">
              <h3>{group.title}</h3>
            </div>
            <ul className="technology-list" aria-label={group.title}>
              {group.icons.map((icon) => (
                <TechnologyChip
                  key={icon}
                  technology={technologies.find(
                    (technology) => technology.icon === icon,
                  )!}
                />
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
