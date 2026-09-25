const placeholders = ["stack", "github"] as const;

export function PlaceholderSections() {
  return (
    <div aria-hidden="true">
      {/* Future-phase anchor targets. Intentionally empty until their assigned phases. */}
      {placeholders.map((id) => (
        <section key={id} id={id} className="phase-placeholder" />
      ))}
    </div>
  );
}
