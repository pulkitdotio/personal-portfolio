import type { LucideIcon } from "lucide-react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import AtSign from "lucide-react/dist/esm/icons/at-sign.mjs";
import BriefcaseBusiness from "lucide-react/dist/esm/icons/briefcase-business.mjs";
import FileText from "lucide-react/dist/esm/icons/file-text.mjs";
import GitFork from "lucide-react/dist/esm/icons/git-fork.mjs";
import Mail from "lucide-react/dist/esm/icons/mail.mjs";
import type { SocialLink as SocialLinkData, SocialIconName } from "../../data/portfolio";

type SocialLinkProps = {
  link: SocialLinkData;
};

const socialIcons: Record<SocialIconName, LucideIcon> = {
  resume: FileText,
  github: GitFork,
  linkedin: BriefcaseBusiness,
  x: AtSign,
  email: Mail,
};

export function SocialLink({ link }: SocialLinkProps) {
  const Icon = socialIcons[link.icon];

  return (
    <a
      className="social-link"
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer noopener" : undefined}
      aria-label={link.external ? `${link.label} (opens in a new tab)` : link.label}
    >
      <span className="social-link-icon">
        <Icon aria-hidden="true" />
      </span>
      <span>{link.label}</span>
      {link.external ? <ArrowUpRight className="social-link-arrow" aria-hidden="true" /> : null}
    </a>
  );
}
