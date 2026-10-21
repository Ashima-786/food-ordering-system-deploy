
import { useState } from 'react'
import './App.css'

const foods = [
  { id: 1, name: 'Classic Burger', category: 'Burgers', price: 149, emoji: '🍔', description: 'Juicy patty, fresh lettuce and our special sauce', color: '#fff0df' },
  { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: 249, emoji: '🍕', description: 'Classic cheese, tomato and fragrant basil', color: '#fce8df' },
  { id: 3, name: 'Crispy French Fries', category: 'Sides', price: 99, emoji: '🍟', description: 'Golden, crispy and perfectly seasoned', color: '#fff4d6' },
  { id: 4, name: 'Fresh Garden Salad', category: 'Healthy', price: 179, emoji: '🥗', description: 'Fresh greens, colourful vegetables and dressing', color: '#e9f3df' },
]

function App() {
  const [cartCount, setCartCount] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Burgers', 'Pizza', 'Sides', 'Healthy']
  const visibleFoods = activeCategory === 'All'
    ? foods
    : foods.filter((food) => food.category === activeCategory)

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✳</span>
          <span>Crave<span className="brand-accent">Cart</span></span>
        </a>

        <nav className="nav-links">
          <a className="active-link" href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#why-us">About</a>
        </nav>

        <a className="cart-button" href="#menu" aria-label={`Cart, ${cartCount} items`}>
          <span>🛒</span> Cart <span className="cart-count">{cartCount}</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow"><span>✦</span> GOOD FOOD, GOOD MOOD</span>
            <h1>Your cravings.<br />Our <span>creation.</span></h1>
            <p className="hero-description">
              Delicious food, made with love and delivered fresh to your door.
              Your next favourite meal is just a click away.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#menu">Explore menu <span>→</span></a>
              <span className="delivery-note">⚡ Quick &amp; fresh delivery</span>
            </div>
            <div className="hero-stats">
              <div><strong>4.9/5</strong><span>Customer rating</span></div>
              <div className="stat-divider" />
              <div><strong>30 min</strong><span>Average delivery</span></div>
              <div className="stat-divider" />
              <div><strong>100%</strong><span>Freshly made</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow" />
            <img src="/src/assets/hero.png" alt="Food featured on our restaurant menu" className="hero-image" />
            <div className="floating-card rating-card">
              <span className="rating-star">★</span>
              <div><strong>4.9 out of 5</strong><small>Loved by foodies</small></div>
            </div>
            <div className="floating-card fresh-card">
              <span className="fresh-icon">🥬</span>
              <div><strong>Fresh ingredients</strong><small>Made daily with care</small></div>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MADE FOR YOUR APPETITE</span>
              <h2>Explore our <span>menu.</span></h2>
              <p>Fresh flavours, favourite classics, and something for every craving.</p>
            </div>
            <span className="menu-count">{visibleFoods.length} delicious choices</span>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? 'selected' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {visibleFoods.map((food) => (
              <article className="food-card" key={food.id}>
                <div className="food-art" style={{ backgroundColor: food.color }}>
                  <span className="food-emoji" role="img" aria-label={food.name}>{food.emoji}</span>
                  <span className="food-tag">Fresh pick</span>
                </div>
                <div className="food-info">
                  <div className="food-title-row">
                    <h3>{food.name}</h3>
                    <span className="food-price">₹{food.price}</span>
                  </div>
                  <p>{food.description}</p>
                  <button className="add-button" onClick={() => setCartCount((count) => count + 1)}>
                    <span>+</span> Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="why-section" id="why-us">
          <span className="eyebrow">A LITTLE EXTRA LOVE</span>
          <h2>Good food. <span>No compromises.</span></h2>
          <div className="benefit-grid">
            <div><span>🥗</span><h3>Fresh ingredients</h3><p>Quality ingredients, chosen with care.</p></div>
            <div><span>👨‍🍳</span><h3>Made to order</h3><p>Prepared fresh when you place your order.</p></div>
            <div><span>🚀</span><h3>Fast delivery</h3><p>From our kitchen to your table.</p></div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home"><span className="brand-icon">✳</span><span>Crave<span className="brand-accent">Cart</span></span></a>
        <p>Made with ♥ for people who love good food.</p>
        <span>© 2026 CraveCart</span>
      </footer>
    </div>
  )
}

export default App
