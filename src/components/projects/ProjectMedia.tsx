import type { CSSProperties } from "react";
import type { ProjectMedia } from "../../data/portfolio";

type ProjectMediaFrameProps = {
  title: string;
  media?: ProjectMedia;
};

export function ProjectMediaFrame({ title, media }: ProjectMediaFrameProps) {
  if (!media) {
    return (
      <div className="project-media project-media--placeholder" role="img" aria-label={`${title} project preview placeholder`}>
        <span aria-hidden="true">Project preview</span>
        <small aria-hidden="true">{title}</small>
      </div>
    );
  }

  const mediaStyle = {
    objectFit: media.objectFit ?? "cover",
    objectPosition: media.objectPosition ?? "center",
  } satisfies CSSProperties;

  return (
    <div className="project-media">
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        style={mediaStyle}
      />
    </div>
  );
}
