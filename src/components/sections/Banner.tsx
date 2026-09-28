import { Container } from "../layout/Container";
import { MagnetLines } from "../motion/MagnetLines";

export function Banner() {
  return (
    <Container className="banner-container">
      <div className="banner" aria-hidden="true">
        <MagnetLines />
      </div>
    </Container>
  );
}
