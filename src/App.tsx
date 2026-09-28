import { ParticleBackground } from "./components/motion/ParticleBackground";
import { Connect } from "./components/sections/Connect";
import { Header } from "./components/layout/Header";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { ClosingCta } from "./components/sections/ClosingCta";
import { GitHubActivity } from "./components/sections/GitHubActivity";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { TechStack } from "./components/sections/TechStack";

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SmoothScroll />
      <ParticleBackground />
      <div id="top" />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Connect />
        <Projects />
        <TechStack />
        <GitHubActivity />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
