import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

type Food = {
  id: number
  name: string
  category: string
  price: number
  emoji: string
  image?: string
  description: string
  rating: string
  tag: string
  color: string
}
type Cart = Record<number, number>
type ActiveView =
  | 'home'
  | 'favorites'
  | 'all-foods'
  | 'restaurants'
  | 'restaurant-menu'

type Restaurant = {
  id: string
  name: string
  city: string
  cuisines: string[]
  image: string
  rating: string
  priceBand?: string
  address?: string
  menuItems?: Food[]
}
const foods = [
  {
    id: 1,
    name: 'Grilled Chicken with Veggies',
    category: 'Healthy',
    price: 299,
    image: '/images/grilled chicken.jpg',
    description: 'Grilled chicken with fresh garden vegetables',
    rating: '4.8',
    tag: 'Bestseller',
    color: '#e9f1df',
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    category: 'Italian',
    price: 249,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
    description: 'Classic tomato, mozzarella and basil',
    rating: '4.7',
    tag: '10% OFF',
    color: '#fff0dc',
  },
  {
    id: 3,
    name: 'Paneer Butter Masala',
    category: 'Indian',
    price: 229,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85',
    description: 'Creamy paneer curry with rich spices',
    rating: '4.9',
    tag: 'Bestseller',
    color: '#f8e9d7',
  },
  {
    id: 4,
    name: 'Sushi Platter',
    category: 'Japanese',
    price: 349,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
    description: 'A delicious selection of fresh sushi',
    rating: '4.6',
    tag: 'Chef’s pick',
    color: '#f7e5e6',
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 149,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85',
    description: 'Warm chocolate cake with a soft centre',
    rating: '4.8',
    tag: 'Popular',
    color: '#f1e8f4',
  },
  {
    id: 6,
    name: 'Classic Zest Burger',
    category: 'Burgers',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    description: 'Crispy lettuce, cheese and signature sauce',
    rating: '4.9',
    tag: 'Must try',
    color: '#fff0df',
  },
]

const cuisines = [
  {
    name: 'Italian',
    image: foods[1].image,
    count: '120+ dishes',
    color: '#e9f1df',
  },
  {
    name: 'Chinese',
    image:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80',
    count: '150+ dishes',
    color: '#edf2e4',
  },
  {
    name: 'Indian',
    image: foods[2].image,
    count: '180+ dishes',
    color: '#fff0dc',
  },
  {
    name: 'Mexican',
    image:
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80',
    count: '90+ dishes',
    color: '#f8e5e2',
  },
  {
    name: 'Japanese',
    image: foods[3].image,
    count: '110+ dishes',
    color: '#f0e8f5',
  },
]



const categories = [
  'All',
  'Italian',
  'Chinese',
  'Indian',
  'Mexican',
  'Japanese',
  'Burgers',
  'Healthy',
  'Desserts',
]

function FoodCard({
  food,
  quantity,
  favorite,
  onToggleFavorite,
  onAddToCart,
}: {
  food: Food
  quantity: number
  favorite: boolean
  onToggleFavorite: () => void
  onAddToCart: () => void
}) {
  return (
    <article className="food-card">
      <div
        className="food-art"
        style={{ backgroundColor: food.color }}
      >
        {food.image ? (
          <img
            className="food-image"
            src={food.image}
            alt={food.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <span className="food-image-placeholder" aria-label={food.name}>
            {food.emoji}
          </span>
        )}

        <span className="food-tag">{food.tag}</span>

        <button
          type="button"
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          onClick={onToggleFavorite}
          aria-label={
            favorite
              ? `Remove ${food.name} from favorites`
              : `Add ${food.name} to favorites`
          }
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="food-info">
        <h3>{food.name}</h3>
        <p>{food.description}</p>

        <div className="food-bottom">
          <div>
            <strong>₹{food.price}</strong>
            <span className="food-rating">★ {food.rating}</span>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={onAddToCart}
            aria-label={`Add ${food.name} to cart`}
          >
            {quantity > 0 ? `+${quantity}` : '+'}
          </button>
        </div>
      </div>
    </article>
  )
}

function RestaurantCard({
  restaurant,
  onClick,
}: {
  restaurant: Restaurant
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="restaurant-card"
      onClick={onClick}
    >
      <div className="restaurant-image-wrap">
        {restaurant.image ? (
          <img
            className="restaurant-image"
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden'
            }}
          />
        ) : (
          <div className="restaurant-image-placeholder">
            🍽️
          </div>
        )}

        <span className="restaurant-rating">
          ★ {restaurant.rating}
        </span>
      </div>

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>

        <p>
          {restaurant.cuisines.length
            ? restaurant.cuisines.join(' · ')
            : 'Discover the menu'}
        </p>

        <small>
          {restaurant.address || restaurant.city || 'Restaurant'}
          {restaurant.priceBand
            ? ` · ${restaurant.priceBand}`
            : ''}
        </small>

        <span className="restaurant-card-link">
          Explore restaurant →
        </span>
      </div>
    </button>
  )
}
const API_BASE = 'https://indiarestros.com/api/v1'



function getRestaurantImage(restaurant: any): string {
  const photo =
    restaurant.photos?.[0]?.url ||
    restaurant.photos?.[0]?.thumb ||
    restaurant.photo ||
    ''

  if (!photo) return ''

  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }

  return `https://indiarestros.com${photo.startsWith('/') ? '' : '/'}${photo}`
}



function mapRestaurant(data: any): Restaurant {
  return {
    id: String(data.id ?? data.irr_id ?? data.slug ?? data.name),
    name: data.name ?? 'Restaurant',
    city: data.city ?? '',
    cuisines: Array.isArray(data.cuisines)
      ? data.cuisines
      : data.cuisine
        ? [data.cuisine]
        : [],
    image: getRestaurantImage(data),
    rating: String(
      data.ratings?.foodie ??
      data.ratings?.external?.rating ??
      data.rating ??
      '—',
    ),
    priceBand: data.price_band ?? '',
    address: data.address ?? data.locality ?? '',
  }
}


async function fetchRestaurants(city: string): Promise<Restaurant[]> {
  const params = new URLSearchParams({
    city: city.trim().toLowerCase(),
    limit: '12',
  })

  const response = await fetch(
    `${API_BASE}/restaurants?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('Unable to load restaurants. Please try again.')
  }

  const result = await response.json()

  const records = Array.isArray(result)
    ? result
    : result.data ?? result.restaurants ?? result.results ?? []

  return records.map(mapRestaurant)
}

function App() {
  const [cart, setCart] = useState<Cart>({})
  const [favorites, setFavorites] = useState<number[]>([])
  const [activeView, setActiveView] = useState<ActiveView>('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantCity, setRestaurantCity] = useState('chennai')
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)
  const [restaurantMenu, setRestaurantMenu] = useState<Food[]>([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState('')
  const [restaurantError, setRestaurantError] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null)
    
useEffect(() => {
  let cancelled = false

  async function loadRestaurants() {
    setRestaurantsLoading(true)
    setRestaurantError('')

    try {
      const data = await fetchRestaurants(restaurantCity)

      if (!cancelled) {
        setRestaurants(data)
      }
    } catch (error) {
      if (!cancelled) {
        setRestaurantError(
          error instanceof Error
            ? error.message
            : 'Unable to load restaurants.',
        )
      }
    } finally {
      if (!cancelled) {
        setRestaurantsLoading(false)
      }
    }
  }

  loadRestaurants()

  return () => {
    cancelled = true
  }
}, [restaurantCity])

useEffect(() => {
  if (activeView !== 'restaurant-menu' || !selectedRestaurant) return

  let cancelled = false

  async function loadMenu() {
    setMenuLoading(true)
    setMenuError('')
    setRestaurantMenu([])

    try {
      const response = await fetch(
        `${API_BASE}/restaurants/${selectedRestaurant!.id}/menu`
      )

      if (!response.ok) {
        throw new Error(`Unable to load menu (${response.status}).`)
      }

      const data = await response.json()

      const menuFoods: Food[] = (data.sections ?? []).flatMap(
        (section: any, sectionIndex: number) =>
          (section.items ?? []).map((item: any, itemIndex: number) => {
            // Create a consistent numeric ID for the cart.
            const id = Array.from(
              `${selectedRestaurant!.id}-${item.dish ?? item.name}`
            ).reduce(
              (hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
              0
            ) + 100000

            return {
              id,
              name: item.name,
              category: section.name ?? 'Menu',
              price: Number(item.price ?? 0),
              emoji: item.veg ? '🥗' : '🍽️',
              image: item.image ?? item.photo ?? item.image_url ?? '',
              description: item.desc ?? '',
              rating: '—',
              tag: item.veg ? 'Veg' : 'Non-veg',
              color: item.veg ? '#e9f1df' : '#fff0dc',
            }
          })
      )

      if (!cancelled) setRestaurantMenu(menuFoods)
    } catch (error) {
      if (!cancelled) {
        setMenuError(
          error instanceof Error ? error.message : 'Unable to load menu.'
        )
      }
    } finally {
      if (!cancelled) setMenuLoading(false)
    }
  }

  loadMenu()

  return () => {
    cancelled = true
  }
}, [activeView, selectedRestaurant])


  const cartCount = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0,
  )

  const allFoods = [...foods, ...restaurantMenu]

const cartItems = allFoods.filter(
  (food) => (cart[food.id] ?? 0) > 0
)

const favoriteItems = allFoods.filter(
  (food) => favorites.includes(food.id)
)

const subtotal = cartItems.reduce(
  (sum, food) => sum + food.price * cart[food.id],
  0
)

  const deliveryFee = subtotal === 0 || subtotal >= 499 ? 0 : 40
  const total = subtotal + deliveryFee

  const visibleFoods = foods.filter((food) => {
    const matchesCategory =
      activeCategory === 'All' || food.category === activeCategory

    const matchesSearch =
      `${food.name} ${food.category}`
        .toLowerCase()
        .includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    if (!cartOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }

    document.body.classList.add('cart-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('cart-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cartOpen])

  const addToCart = (id: number) => {
    setCart((current) => ({
      ...current,
      [id]: (current[id] ?? 0) + 1,
    }))
  }

  const changeQuantity = (id: number, amount: number) => {
    setCart((current) => {
      const updated = { ...current }
      const nextQuantity = (updated[id] ?? 0) + amount

      if (nextQuantity <= 0) {
        delete updated[id]
      } else {
        updated[id] = nextQuantity
      }

      return updated
    })
  }

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    )
  }

  const showCategory = (category: string) => {
    setActiveView('home')
    setActiveCategory(category)

    window.setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({
        behavior: 'smooth',
      })
    }, 0)
  }

  const returnHome = () => {
    setActiveView('home')
    setCartOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openCart = () => setCartOpen(true)

  const renderFoodCards = (items: Food[]) => (
    <div className="food-grid">
      {items.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          quantity={cart[food.id] ?? 0}
          favorite={favorites.includes(food.id)}
          onToggleFavorite={() => toggleFavorite(food.id)}
          onAddToCart={() => addToCart(food.id)}
        />
      ))}
    </div>
  )

  return (
    <div className="app" id="home">
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={() => {
            setActiveView('home')
            setCartOpen(false)
          }}
        >
          <span className="brand-icon">✳</span>
          <span>Zestora</span>
        </a>

        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onFocus={() => setActiveView('home')}
            onChange={(event) => {
              setSearch(event.target.value)
              setActiveView('home')
            }}
            placeholder="Search dishes, cuisines..."
            aria-label="Search food"
          />
          <button
            type="button"
            aria-label="Search menu"
            onClick={() => showCategory(activeCategory)}
          >
            ⌕
          </button>
        </label>

        <nav className="nav-actions">
          <button
            type="button"
            className={`nav-action-button ${
              activeView === 'favorites' ? 'nav-action-selected' : ''
            }`}
            onClick={() => {
              setCartOpen(false)
              setActiveView('favorites')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{favorites.length > 0 ? '♥' : '♡'}</span>
            <small>Favorites ({favorites.length})</small>
          </button>

          <button
            type="button"
            className={`nav-action-button cart-link ${
              cartOpen ? 'nav-action-selected' : ''
            }`}
            onClick={openCart}
            aria-label={`Open cart with ${cartCount} items`}
          >
            <span>
              <svg
                className="nav-cart-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="18" cy="21" r="1" />
              </svg>
              <i>{cartCount}</i>
            </span>
            <small>Cart</small>
          </button>

          <Link to="/login" className="account-link">
            <span className="account-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </span>
            <small>Account</small>
          </Link>
        </nav>
      </header>

      <div className="page-layout">
        <aside className="sidebar">
          <nav>
            <a
              className={`sidebar-link ${
                activeView === 'home' ? 'active' : ''
              }`}
              href="#home"
              onClick={() => {
                setActiveView('home')
                setCartOpen(false)
              }}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m3 10 9-7 9 7" />
                  <path d="M5 9v12h14V9" />
                  <path d="M9 21v-7h6v7" />
                </svg>
              </span>
              Home
            </a>

            <a
              className="sidebar-link"
              href="#menu"
              onClick={() => {
                setActiveView('home')
                setCartOpen(false)
              }}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                  <circle cx="2.5" cy="5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </span>
              Menu
            </a>

            <a
              className="sidebar-link"
              href="#cuisines"
              onClick={() => {
                setActiveView('home')
                setCartOpen(false)
              }}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </span>
              Categories
            </a>

            <a
              className="sidebar-link"
              href="#offers"
              onClick={() => {
                setActiveView('home')
                setCartOpen(false)
              }}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.5 13.5 13 21 3 11V3h8l9.5 10.5Z" />
                  <circle cx="7.5" cy="7.5" r="1.2" />
                  <path d="m12 8 4 4" />
                </svg>
              </span>
              Offers
            </a>

            <button
              type="button"
              className="sidebar-link sidebar-button"
              onClick={openCart}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M1 2h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 7H6" />
                </svg>
              </span>
              Cart ({cartCount})
            </button>

            <button
              type="button"
              className={`sidebar-link sidebar-button ${
                activeView === 'favorites' ? 'active' : ''
              }`}
              onClick={() => {
                setCartOpen(false)
                setActiveView('favorites')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <span className="nav-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
              </span>
              Favorites
            </button>

            <a
              className="sidebar-link"
              href="#support"
              onClick={() => {
                setActiveView('home')
                setCartOpen(false)
              }}
            >
              
            <span className="nav-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 13v-2a9 9 0 0 1 18 0v2" />
                <rect x="3" y="12" width="4" height="7" rx="2" />
                <rect x="17" y="12" width="4" height="7" rx="2" />
                <path d="M21 17v1a4 4 0 0 1-4 4h-3" />
              </svg>
            </span>
            Support
            </a>
          </nav>
          <div className="sidebar-offer">
            <span>YOUR FIRST BITE</span>
            <h3>Get 20% OFF</h3>
            <p>on your first order</p>
            <a href="#offers" onClick={() => setActiveView('home')}>
              Order now →
            </a>
            <img
              className="offer-image"
              src={foods[0].image}
              alt="Fresh grilled meal"
              loading="lazy"
            />
          </div>
        </aside>

        <main className="main-content">
          {activeView === 'home' ? (
            <>
              <section className="hero">
                <div className="hero-content">
                  <span className="eyebrow">GOOD FOOD, GOOD MOOD</span>
                  <h1>
                    Delicious Food
                    <br />
                    <span>Delivered Fast.</span>
                  </h1>
                  <p className="hero-description">
                    Discover your favourite flavours, explore delicious
                    cuisines and enjoy great food delivered to your door.
                  </p>

                  <div className="hero-actions">
                    <a className="primary-button" href="#menu">
                      Order Now <span>→</span>
                    </a>
                    <a className="secondary-button" href="#cuisines">
                      Explore Menu <span>▶</span>
                    </a>
                  </div>

                  <div className="hero-social-proof">
                      <span className="avatar-stack" aria-hidden="true">
                        <img src="/images/99230041167-Ranjana Gayatri B.jpeg" alt="" />
                        <img src="/images/ashima.jpeg" alt="" />
                        <img src="/images/NITHEES.jpg" alt="" />
                        <img src="/images/kasim.jpeg" alt="" />
                      </span>
                      <span>
                      <strong>50K+</strong> happy food lovers
                    </span>
                  </div>
                </div>

                <div className="hero-visual">
                  <div className="hero-decoration" />
                  <img
                    src="/images/chickenburger-removebg-preview.png"
                    alt="Zestora featured meal"
                    className="hero-image"
                  />
                  <div className="hero-food-card">
                    <strong>Today's special</strong>
                    <span>Chicken Burger</span>
                    <b>₹199.00</b>
                  </div>
                  <span className="hero-sparkle sparkle-one">✦</span>
                  <span className="hero-sparkle sparkle-two">✧</span>
                </div>
              </section>

              <section className="benefits" aria-label="Our service benefits">
                <div className="feature-card">
                  <span className="feature-icon">
                    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <path d="M12 27 32 10 52 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 25V51H47V25" fill="#FFD5AB" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                      <path d="M25 51V38Q32 30 39 38V51" fill="#FFF9F2" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M44 12 49 7M47 17 55 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    <strong>Free Delivery</strong>
                    <small>On orders over ₹499</small>
                  </p>
                </div>

                <div className="feature-card">
                  <span className="feature-icon">
                    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <rect x="12" y="12" width="40" height="40" rx="12" fill="#FFD5AB" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M23 23H41M23 31H36M23 39H31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="44" cy="43" r="10" fill="#FFF9F2" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M44 37V43L48 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    <strong>Easy Ordering</strong>
                    <small>A few clicks to enjoy</small>
                  </p>
                </div>

                <div className="feature-card">
                  <span className="feature-icon">
                    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <path d="M32 8 49 15V29Q47 43 32 53Q17 43 15 29V15Z" fill="#FFD5AB" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                      <rect x="24" y="25" width="16" height="12" rx="3" fill="#FFF9F2" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M27 25V21A5 5 0 0 1 37 21V25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <p>
                    <strong>Secure Payment</strong>
                    <small>Checkout with confidence</small>
                  </p>
                </div>

                <div className="feature-card">
                  <span className="feature-icon">
                    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
                      <path d="M15 34V29A17 17 0 0 1 49 29V34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <rect x="11" y="30" width="11" height="17" rx="5" fill="#FFD5AB" stroke="currentColor" strokeWidth="2.5" />
                      <rect x="42" y="30" width="11" height="17" rx="5" fill="#FFD5AB" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M48 47Q45 54 34 54H29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <rect x="23" y="48" width="12" height="9" rx="3" fill="#FFF9F2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                  <p>
                    <strong>Friendly Support</strong>
                    <small>We're here to help</small>
                  </p>
                </div>

              </section>

              <section className="content-section" id="cuisines">
                <div className="section-heading compact-heading">
                  <div>
                    <h2>Explore by Cuisine</h2>
                    <p>Find something delicious for every mood.</p>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => showCategory('All')}
                  >
                    View All →
                  </button>
                </div>

                <div className="cuisine-grid">
                  {cuisines.map((cuisine) => (
                    <button
                      type="button"
                      className="cuisine-card"
                      key={cuisine.name}
                      style={{ backgroundColor: cuisine.color }}
                      onClick={() => showCategory(cuisine.name)}
                    >
                      <img
                        className="cuisine-image"
                        src={cuisine.image}
                        alt={cuisine.name}
                        loading="lazy"
                      />
                      <strong>{cuisine.name}</strong>
                      <small>{cuisine.count}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="content-section" id="restaurants">
                <div className="section-heading compact-heading">
                  <div>
                    <h2>Discover Restaurants</h2>
                    <p>Explore restaurants and discover your next favourite meal.</p>
                  </div>
                </div>

                <div className="restaurant-location">
                  <label htmlFor="restaurant-city">Choose a city</label>

                  <select
                    id="restaurant-city"
                    value={restaurantCity}
                    onChange={(event) => setRestaurantCity(event.target.value)}
                  >
                    <option value="chennai">Chennai</option>
                    <option value="madurai">Madurai</option>
                    <option value="coimbatore">Coimbatore</option>
                    <option value="tiruchirappalli">Tiruchirappalli</option>
                    <option value="salem">Salem</option>
                    <option value="bengaluru">Bengaluru</option>
                  </select>
                </div>

                {restaurantsLoading ? (
                  <p className="restaurant-message">
                    Finding delicious restaurants...
                  </p>
                ) : restaurantError ? (
                  <div className="restaurant-message restaurant-error">
                    <p>{restaurantError}</p>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setRestaurantCity((city) => city)}
                    >
                      Try again
                    </button>
                  </div>
                ) : restaurants.length === 0 ? (
                  <p className="restaurant-message">
                    No restaurants were found for this city.
                  </p>
                ) : (
                  <>
                    <p className="restaurant-result-count">
                      {restaurants.length} restaurants found
                    </p>

                    <div className="restaurant-grid">
                      {restaurants.map((restaurant) => (
                        <RestaurantCard
                          key={restaurant.id}
                          restaurant={restaurant}
                          onClick={() => {
                            setSelectedRestaurant(restaurant)
                            setActiveView('restaurant-menu')
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </section>
              <section className="content-section" id="menu">
                <div className="section-heading compact-heading">
                  <div>
                    <h2>Popular Dishes</h2>
                    <p>Good things are always worth sharing.</p>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setActiveCategory('All')
                      setSearch('')
                    }}
                  >
                    View All →
                  </button>
                </div>

                <div className="category-list">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`category-button ${
                        activeCategory === category ? 'selected' : ''
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {visibleFoods.length > 0 ? (
                  renderFoodCards(visibleFoods)
                ) : (
                  <p className="empty-state">
                    No dishes found. Try another search or category.
                  </p>
                )}
              </section>

              <section className="promo-grid" id="offers">
                <article className="promo-card green-promo">
                  <div>
                    <span className="promo-label">✦ LIMITED-TIME OFFER</span>
                    <h2>Flat 30% OFF</h2>
                    <h3>On Your First Order!</h3>
                    <p>
                      Use code <strong>ZEST30</strong> at checkout.
                    </p>
                    <a href="#menu">Order Now →</a>
                  </div>
                  <img
                    className="promo-image"
                    src={foods[0].image}
                    alt="Fresh grilled food"
                    loading="lazy"
                  />
                </article>

                <article className="promo-card orange-promo">
                  <div>
                    <span className="promo-label">✦ WEEKEND SPECIAL</span>
                    <h2>Family Combo Meals</h2>
                    <p>
                      Bring everyone together with a delicious feast.
                    </p>
                    <a href="#menu">Explore combos →</a>
                  </div>
                  <img
                    className="promo-image"
                    src={foods[5].image}
                    alt="Classic burger"
                    loading="lazy"
                  />
                </article>
              </section>

              <section className="trust-strip">
                <strong>Loved by food lovers</strong>
                <span>Fresh ingredients</span>
                <span>✦ Top rated meals</span>
                <span>Fast delivery</span>
                <span>Made with care</span>
              </section>

              <footer className="footer" id="support">
                <div className="footer-main">
                  <div className="footer-brand">
                    <a className="brand" href="#home">
                      <span className="brand-icon">✳</span>
                      <span>Zestora</span>
                    </a>
                    <p>
                      Your favourite food, delivered fresh to your door.
                      A little joy in every bite.
                    </p>
                    <div className="social-links">
                      <a href="#instagram" aria-label="Instagram">◎</a>
                      <a href="#facebook" aria-label="Facebook">f</a>
                      <a href="#social" aria-label="Social media">𝕏</a>
                    </div>
                  </div>

                  <div>
                    <h4>Explore</h4>
                    <a href="#home">Home</a>
                    <a href="#menu">Our Menu</a>
                    <a href="#offers">Special Offers</a>
                    <a href="#cuisines">Cuisines</a>
                  </div>

                  <div>
                    <h4>Support</h4>
                    <a href="#support">Help Centre</a>
                    <a href="#orders">Track Order</a>
                    <a href="#support">FAQs</a>
                    <a href="#support">Contact Us</a>
                  </div>

                  <div>
                    <h4>Information</h4>
                    <a href="#about">About Zestora</a>
                    <a href="#terms">Terms &amp; Conditions</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#refunds">Refund Policy</a>
                  </div>
                </div>

                <div className="footer-bottom">
                  <span>© 2026 Zestora. Made with ♥ for food lovers.</span>
                  <a href="#privacy">Privacy</a>
                  <a href="#terms">Terms</a>
                </div>
              </footer>
            </>
                    ) : activeView === 'restaurant-menu' ? (
            <section className="content-section shopping-view">
              <button
                type="button"
                className="text-link"
                onClick={() => setActiveView('home')}
              >
                ← Back to restaurants
              </button>

              <div className="shopping-heading">
                <span className="eyebrow">EXPLORE THE MENU</span>
                <h1>{selectedRestaurant?.name ?? 'Restaurant Menu'}</h1>
                <p>{selectedRestaurant?.cuisines.join(' · ')}</p>
              </div>

              {menuLoading ? (
                <p className="restaurant-message">
                  Loading restaurant menu...
                </p>
              ) : menuError ? (
                <p className="restaurant-message restaurant-error">
                  {menuError}
                </p>
              ) : restaurantMenu.length === 0 ? (
                <p className="restaurant-message">
                  No menu items are available for this restaurant.
                </p>
              ) : (
                Array.from(
                  new Set(restaurantMenu.map((food) => food.category))
                ).map((category) => (
                  <section className="content-section" key={category}>
                    <div className="section-heading compact-heading">
                      <div>
                        <h2>{category}</h2>
                      </div>
                    </div>

                    {renderFoodCards(
                      restaurantMenu.filter(
                        (food) => food.category === category
                      )
                    )}
                  </section>
                ))
              )}
            </section>
          ) : (
            <section className="content-section shopping-view">
              <button
                type="button"
                className="text-link"
                onClick={returnHome}
              >
                ← Continue shopping
              </button>

              <div className="shopping-heading">
                <span className="eyebrow">SAVED FOR LATER</span>
                <h1>Your Favorites</h1>
                <p>Your most-loved dishes, all in one place.</p>
              </div>

              {favoriteItems.length === 0 ? (
                <div className="shopping-empty">
                  <span>♡</span>
                  <h2>No favorites just yet.</h2>
                  <p>Tap the heart on any dish to save it here.</p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={returnHome}
                  >
                    Discover Dishes →
                  </button>
                </div>
              ) : (
                renderFoodCards(favoriteItems)
              )}
            </section>
          )}
        </main>
      </div>

      {cartOpen && (
        <div
          className="cart-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCartOpen(false)
            }
          }}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            <div className="cart-drawer-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2 id="cart-drawer-title">Your Cart ({cartCount})</h2>
              </div>
              <button
                type="button"
                className="cart-close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="shopping-empty cart-drawer-empty">
                <span className="empty-cart-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 1.9-1.4L22 8H6" />
                    <circle cx="10" cy="21" r="1" />
                    <circle cx="18" cy="21" r="1" />
                  </svg>
                </span>
                <h2>Your cart is waiting for something delicious.</h2>
                <p>Discover your favourites and add them to your basket.</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setCartOpen(false)
                    setActiveView('home')
                    window.setTimeout(() => {
                      document.getElementById('menu')?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }, 0)
                  }}
                >
                  Explore Menu →
                </button>
              </div>
            ) : (
              <>
                <div className="cart-drawer-content">
                  <p className="cart-items-count">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} in your basket
                  </p>

                  <div className="cart-items-list">
                    {cartItems.map((food) => (
                      <article className="cart-item" key={food.id}>
                        <div
                          className="cart-item-image"
                          style={{ backgroundColor: food.color }}
                        >
                          <img
                            className="cart-food-image"
                            src={food.image}
                            alt={food.name}
                            loading="lazy"
                          />
                        </div>

                        <div className="cart-item-details">
                          <span className="cart-item-category">
                            {food.category}
                          </span>
                          <h3>{food.name}</h3>
                          <strong>₹{food.price}</strong>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() =>
                              changeQuantity(food.id, -(cart[food.id] ?? 0))
                            }
                          >
                            Remove
                          </button>
                        </div>

                        <div className="cart-item-right">
                          <strong>₹{food.price * cart[food.id]}</strong>
                          <div className="quantity-control">
                            <button
                              type="button"
                              onClick={() => changeQuantity(food.id, -1)}
                              aria-label={`Decrease ${food.name} quantity`}
                            >
                              −
                            </button>
                            <span>{cart[food.id]}</span>
                            <button
                              type="button"
                              onClick={() => addToCart(food.id)}
                              aria-label={`Increase ${food.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>

                <div className="cart-drawer-footer">
                  <h3>Order Summary</h3>
                  <p>
                    <span>Subtotal</span>
                    <strong>₹{subtotal}</strong>
                  </p>
                  <p>
                    <span>Delivery fee</span>
                    <strong>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </strong>
                  </p>

                  {subtotal > 0 && subtotal < 499 && (
                    <small className="delivery-note">
                      Add ₹{499 - subtotal} more for free delivery.
                    </small>
                  )}

                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{total}</strong>
                  </div>

                  <button
                    type="button"
                    className="primary-button cart-checkout"
                    onClick={() =>
                      window.alert(
                        'Checkout will be connected to the Python backend later.',
                      )
                    }
                  >
                    Proceed to Checkout →
                  </button>

                  <small className="cart-secure">
                    Secure checkout · Fresh food, delivered
                  </small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
