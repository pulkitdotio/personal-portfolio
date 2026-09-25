import { Header } from "./components/layout/Header";
import { SmoothScroll } from "./components/layout/SmoothScroll";
import { Banner } from "./components/sections/Banner";
import { Connect } from "./components/sections/Connect";
import { HeroAbout } from "./components/sections/HeroAbout";
import { PlaceholderSections } from "./components/sections/PlaceholderSections";
import { Projects } from "./components/sections/Projects";

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
        <PlaceholderSections />
      </main>
    </SmoothScroll>
  );
}

export default App;
