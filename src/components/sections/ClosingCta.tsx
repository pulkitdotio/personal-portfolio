import { useEffect, useRef, useState, type FormEvent } from "react";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.mjs";
import Copy from "lucide-react/dist/esm/icons/copy.mjs";
import Check from "lucide-react/dist/esm/icons/check.mjs";

import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";

const contactEmail = "pulkit1865@gmail.com";

export function ClosingCta() {
  const [status, setStatus] = useState("");
  const [draftOpened, setDraftOpened] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setStatus("Email copied");
    } catch {
      setStatus("Couldn't copy. Select the email address to copy it.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 4000);
  };
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(
      ["name", "email", "subject", "message"].map((name) => [
        name,
        String(data.get(name) ?? "").trim(),
      ]),
    );
    for (const name of Object.keys(values)) {
      if (!values[name]) {
        const field = form.elements.namedItem(name);
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement
        ) {
          field.setCustomValidity("Please fill out this field.");
          field.reportValidity();
        }
        return;
      }
    }
    const body = `Hi Pulkit,\n\n${values.message}\n\nFrom:\n${values.name}\n${values.email}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    setDraftOpened(true);
  };
  const clearValidation = (event: FormEvent<HTMLFormElement>) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      event.target.setCustomValidity("");
    }
    setDraftOpened(false);
  };
  return (
    <Container
      as="section"
      id="contact"
      className="section closing-section"
      aria-labelledby="closing-title"
    >
      <div className="closing-content">
        <div className="contact-intro">
          <Reveal className="contact-eyebrow">
            <span>CONTACT</span>
            <span className="contact-rule" aria-hidden="true" />
          </Reveal>
          <Reveal className="contact-heading" delay={0.07}>
            <h2 id="closing-title">Let&apos;s talk.</h2>
            <p className="contact-description">
              If you have a project in mind, a question, or just want to say
              hello, I’d love to hear from you.
            </p>
          </Reveal>
          <Reveal className="contact-direct" delay={0.14}>
            <p className="contact-label">OR REACH ME DIRECTLY</p>
            <div className="email-row">
              <a className="email-address" href={`mailto:${contactEmail}`}>
                <span>{contactEmail}</span>
                <ArrowUpRight aria-hidden="true" />
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
          </Reveal>
        </div>
        <Reveal className="contact-form-panel" delay={0.21}>
          <form
            className="contact-form"
            aria-label="Contact form"
            onSubmit={sendMessage}
            onInput={clearValidation}
          >
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-name">
                NAME
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-email">
                EMAIL
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-subject">
                SUBJECT
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                required
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="contact-message">
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell me a bit about your project..."
                rows={4}
                required
              />
            </div>
            <button className="contact-submit" type="submit">
              <span>Send message</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
            <p
              className="contact-form-feedback"
              aria-live="polite"
              aria-atomic="true"
            >
              {draftOpened ? "Send your draft from your email app." : ""}
            </p>
          </form>
        </Reveal>
      </div>
    </Container>
  );
}
