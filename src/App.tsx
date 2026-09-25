import { Header } from "./components/layout/Header";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Banner } from "./components/sections/Banner";
import { ClosingCta } from "./components/sections/ClosingCta";
import { Connect } from "./components/sections/Connect";
import { GitHubActivity } from "./components/sections/GitHubActivity";
import { HeroAbout } from "./components/sections/HeroAbout";
import { Projects } from "./components/sections/Projects";
import { TechStack } from "./components/sections/TechStack";

function App() {
  return (
    <SmoothScroll>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main-content">
        <Banner />
        <HeroAbout />
        <Connect />
        <Projects />
        <TechStack />
        <GitHubActivity />
        <ClosingCta />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}

export default App;
