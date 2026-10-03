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
      <div className="about-rows">
        <Reveal className="about-row">
          <span className="about-arrow" aria-hidden="true">
            →
          </span>
          <div className="about-row-copy">
            <h3>End-to-end development</h3>
            <p>
              I build products end to end with{" "}
              <span className="about-technology">React</span>,{" "}
              <span className="about-technology">Next.js</span>,{" "}
              <span className="about-technology">TypeScript</span>, and{" "}
              <span className="about-technology">Node.js</span> — from shaping
              the data and API design all the way to the interface people use.
            </p>
          </div>
        </Reveal>
        <Reveal className="about-row" delay={0.07}>
          <span className="about-arrow" aria-hidden="true">
            →
          </span>
          <div className="about-row-copy">
            <h3>Backend and systems</h3>
            <p>
              On the backend, I work with{" "}
              <span className="about-technology">Express</span>,{" "}
              <span className="about-technology">MongoDB</span>,{" "}
              <span className="about-technology">PostgreSQL</span>, and{" "}
              <span className="about-technology">Supabase</span>, with a strong
              bias toward clear architecture, solid validation, correctness, and
              predictable failure handling.
            </p>
          </div>
        </Reveal>
        <Reveal className="about-row" delay={0.14}>
          <span className="about-arrow" aria-hidden="true">
            →
          </span>
          <div className="about-row-copy">
            <h3>Learning through building</h3>
            <p>
              I use projects to go beyond shipping features. I like
              understanding how systems behave, how different parts connect,
              where they can fail, and how a design should evolve as an
              application grows.
            </p>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
