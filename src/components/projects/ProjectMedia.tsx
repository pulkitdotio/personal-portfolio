import type { CSSProperties } from "react";
import type { ProjectMedia } from "../../data/portfolio";

type ProjectMediaFrameProps = {
  title: string;
  media?: ProjectMedia;
};

export function ProjectMediaFrame({ title, media }: ProjectMediaFrameProps) {
  if (!media) {
    return (
      <div
        className="project-media project-media--placeholder"
        role="img"
        aria-label={`${title} preview unavailable`}
      >
        <span aria-hidden="true">Preview unavailable</span>
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
        srcSet={media.srcSet}
        sizes={media.sizes}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading="lazy"
        decoding="async"
        style={mediaStyle}
      />
    </div>
  );
}
