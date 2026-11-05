import Link from "next/link";
import AccountActions from "./account-actions";

const categories = [
  { name: "Sneakers", icon: "👟", color: "#fdf2e9" },
  { name: "Audio", icon: "🎧", color: "#eef5ff" },
  { name: "Watches", icon: "⌚", color: "#f5f0ff" },
  { name: "Home", icon: "🏠", color: "#eefbf4" },
];

const featuredProducts = [
  { name: "Nova Runner Pro", price: "$149", tag: "New arrival", accent: "#ffedd5" },
  { name: "Echo Wireless", price: "$99", tag: "Best seller", accent: "#dbeafe" },
  { name: "Aster Smart Watch", price: "$219", tag: "Trending", accent: "#f3e8ff" },
  { name: "Luma Lamp", price: "$89", tag: "Eco pick", accent: "#dcfce7" },
];

const offers = [
  { label: "Free shipping", detail: "On all orders over $100" },
  { label: "Cashback", detail: "Up to 12% on essentials" },
  { label: "Easy returns", detail: "30-day refund policy" },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">L</span>
          <span>LuxeCart</span>
        </div>

        <nav className="nav">
          <a href="#">New In</a>
          <a href="#">Women</a>
          <a href="#">Men</a>
          <a href="#">Accessories</a>
          <a href="#">Deals</a>
        </nav>

        <div className="nav-actions">
          <button className="ghost-btn">Search</button>
          <AccountActions />
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fresh arrivals</p>
          <h1>Upgrade your everyday essentials.</h1>
          <p className="subtitle">
            Discover premium essentials built for comfort, style, and smarter living.
          </p>

          <div className="hero-actions">
            <Link href="/login" className="primary-btn large">Shop now</Link>
            <button className="secondary-btn">View offers</button>
          </div>

          <div className="stats-row">
            <div>
              <strong>40k+</strong>
              <span>happy shoppers</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>48h</strong>
              <span>fast delivery</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="product-card highlight">
            <span className="product-tag">Limited edition</span>
            <div className="shoe-visual">👟</div>
            <div className="product-info">
              <span>Nova Runner Pro</span>
              <strong>$149</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2>Popular picks</h2>
          </div>
          <a href="#">See all</a>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.name} className="category-card" style={{ background: category.color }}>
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Trending products</h2>
          </div>
          <a href="#">View collection</a>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <article key={product.name} className="product-item">
              <div className="product-image" style={{ background: product.accent }}>
                {product.name.includes("Watch") ? "⌚" : product.name.includes("Lamp") ? "💡" : product.name.includes("Audio") ? "🎧" : "👟"}
              </div>
              <div className="product-meta">
                <span className="mini-tag">{product.tag}</span>
                <h3>{product.name}</h3>
                <div className="product-row">
                  <strong>{product.price}</strong>
                  <button>Add to cart</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="offers-panel">
        {offers.map((offer) => (
          <div key={offer.label} className="offer-box">
            <strong>{offer.label}</strong>
            <span>{offer.detail}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
