export function PrepRolePlaceholder() {
  return (
    <div className="project-placeholder preprole-placeholder" aria-hidden="true">
      <div className="profile-document visual-document">
        <span className="document-label">PROFILE</span>
        <i className="document-avatar" />
        <i />
        <i />
        <i className="short" />
      </div>

      <div className="role-document visual-document">
        <span className="document-label">TARGET ROLE</span>
        <strong>FS</strong>
        <i />
        <i className="short" />
      </div>

      <div className="analysis-flow">
        <span />
        <b>86%</b>
        <span />
      </div>

      <div className="skill-gap-panel">
        <small>SKILL SIGNALS</small>
        <div>
          <span>APIs</span>
          <span>System design</span>
          <span>Redis</span>
        </div>
      </div>

      <div className="question-stack">
        <span>01</span>
        <i />
        <i className="short" />
      </div>
      <div className="question-stack question-stack--back">
        <span>02</span>
        <i />
        <i className="short" />
      </div>
    </div>
  );
}
