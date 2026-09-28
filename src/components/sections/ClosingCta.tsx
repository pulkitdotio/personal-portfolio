import { useEffect, useRef, useState } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import Copy from "lucide-react/dist/esm/icons/copy.mjs";
import Check from "lucide-react/dist/esm/icons/check.mjs";

import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";

export function ClosingCta() {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("pulkit1865@gmail.com");
      setStatus("Email copied");
    } catch {
      setStatus("Couldn't copy. Select the email address to copy it.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  };
  return (
    <Container
      as="section"
      id="contact"
      className="section closing-section"
      aria-labelledby="closing-title"
    >
      <Reveal className="closing-content">
        <h2 id="closing-title">Let&apos;s talk.</h2>
        <div className="closing-bottom">
          <div>
            <p>
              If you want to discuss a project or anything technical, send me an
              email.
            </p>
            <div className="email-row">
              <a className="email-address" href="mailto:pulkit1865@gmail.com">
                pulkit1865@gmail.com <ArrowUpRight aria-hidden="true" />
              </a>
              <button
                type="button"
                className="icon-button copy-button"
                aria-label="Copy email address"
                onClick={copyEmail}
              >
                {status === "Email copied" ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Copy aria-hidden="true" />
                )}
              </button>
            </div>
            <span className="copy-status" role="status">
              {status}
            </span>
          </div>
          <a
            className="button button-primary"
            href="mailto:pulkit1865@gmail.com"
          >
            Send email <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </Container>
  );
}
