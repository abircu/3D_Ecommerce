import { Link } from 'react-router-dom'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">AETHER</div>
      <div className="footer-grid">
        <p>
          Concept storefront. Frontend only — the bag is local to this browser, and checkout does not
          charge anything.
        </p>
        <nav>
          <Link to="/shop" data-cursor="go">Shop</Link>
          <Link to="/atelier" data-cursor="go">Atelier</Link>
          <Link to="/" data-cursor="go">Orbit</Link>
        </nav>
        <p className="footer-meta">
          Photography via Unsplash
          <br />
          © {YEAR}
        </p>
      </div>
    </footer>
  )
}
