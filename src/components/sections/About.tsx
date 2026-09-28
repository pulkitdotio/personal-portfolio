import feather from "../../assets/identity/feather.webp";
import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function About() {
  return (
    <Container
      as="section"
      id="about"
      tabIndex={-1}
      className="section about-section"
      aria-labelledby="about-title"
    >
      <SectionHeading title="About" id="about-title" />
      <div className="about-grid">
        <Reveal className="about-identity">
          <img src={feather} alt="" width="56" height="56" />
          <span>Pulkit Sharma</span>
        </Reveal>
        <div className="about-copy">
          <Reveal>
            <p>
              I build full-stack web applications, mostly with the MERN stack.
            </p>
          </Reveal>
          <Reveal delay={0.07}>
            <p>
              I enjoy backend work as much as frontend work, especially APIs,
              databases, and the systems behind an application.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p>
              I&apos;m also interested in AI/ML and use Python-based tools when
              a project genuinely benefits from them.
            </p>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
