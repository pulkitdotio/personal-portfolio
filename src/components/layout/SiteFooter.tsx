import ArrowUp from "lucide-react/dist/esm/icons/arrow-up.mjs";
import feather from "../../assets/identity/feather.webp";
import { Container } from "./Container";
export function SiteFooter() {
  return (
    <Container as="footer" className="site-footer">
      <div className="footer-inner">
        <div className="footer-identity">
          <img src={feather} alt="" width="26" height="26" />
          <span>Pulkit Sharma</span>
        </div>
        <span className="footer-copyright">
          &copy; {new Date().getFullYear()} Pulkit Sharma
        </span>
        <a className="back-to-top" href="#top">
          Back to top <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </Container>
  );
}
