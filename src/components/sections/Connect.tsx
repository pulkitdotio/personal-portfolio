import FileText from "lucide-react/dist/esm/icons/file-text.mjs";
import Send from "lucide-react/dist/esm/icons/send.mjs";
import { githubIconPath } from "../../data/simpleIconPaths";

import Mail from "lucide-react/dist/esm/icons/mail.mjs";
import xSvg from "simple-icons/icons/x.svg?raw";
import { socialLinks } from "../../data/portfolio";
import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { timings } from "../../lib/motion";
const xPath = xSvg.match(/<path d="([^"]+)"/)?.[1];
function Github() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={githubIconPath} fill="currentColor" />
    </svg>
  );
}
function Linkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="2" fill="currentColor" />
      <path
        fill="#fff"
        d="M5 9h3v10H5zm1.5-4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M10 9h3v1.4c.7-1.1 1.7-1.7 3-1.7 2.6 0 3.5 1.6 3.5 4.2V19h-3v-5.3c0-1.4-.3-2.3-1.6-2.3-1.4 0-1.9 1-1.9 2.4V19h-3z"
      />
    </svg>
  );
}
const links = [
  { ...socialLinks.find((l) => l.icon === "resume")!, Icon: FileText },
  {
    label: "Contact",
    href: "#contact",
    external: false,
    icon: "contact",
    Icon: Send,
  },
  { ...socialLinks.find((l) => l.icon === "github")!, Icon: Github },
  { ...socialLinks.find((l) => l.icon === "linkedin")!, Icon: Linkedin },
  {
    ...socialLinks.find((l) => l.icon === "x")!,
    label: "X (Twitter)",
    Icon: null,
  },
  { ...socialLinks.find((l) => l.icon === "email")!, Icon: Mail },
];
export function Connect() {
  return (
    <Container
      as="section"
      id="connect"
      className="section connect-section"
      aria-labelledby="connect-title"
    >
      <SectionHeading title="Connect" id="connect-title" />
      <div className="connect-grid">
        {links.map(({ Icon, ...link }, index) => (
          <Reveal key={link.icon} delay={index * timings.stagger}>
            <a
              className={`connect-button connect-button--${link.icon}`}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer noopener" : undefined}
            >
              {Icon ? (
                <Icon aria-hidden="true" />
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={xPath} fill="currentColor" />
                </svg>
              )}
              <span>{link.label}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
