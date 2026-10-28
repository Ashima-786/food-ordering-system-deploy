import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

type Food = {
  id: number
  name: string
  category: string
  price: number
  emoji?: string
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
  | 'orders'
  | 'admin'

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
    name: 'Ambur Chicken Dum Biryani',
    category: 'South Indian',
    price: 279,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=85',
    description: 'Aromatic Seeraga Samba rice cooked with tender spiced chicken, mint & boiled egg in traditional Ambur style',
    rating: '4.9',
    tag: 'Tamil Bestseller ⭐',
    color: '#fff1dc',
  },
  {
    id: 2,
    name: 'Madurai Bun Parotta & Salna',
    category: 'South Indian',
    price: 169,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85',
    description: 'Crispy flaky Madurai special multi-layered bun parotta served with piping hot spicy chicken salna',
    rating: '4.9',
    tag: 'Must Try 🔥',
    color: '#fef3c7',
  },
  {
    id: 3,
    name: 'Chicken Kothu Parotta',
    category: 'South Indian',
    price: 219,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
    description: 'Shredded crispy parotta beaten on cast-iron tawa with eggs, tender chicken pieces, curry leaves & rich gravy',
    rating: '4.8',
    tag: 'Street Icon',
    color: '#fee2e2',
  },
  {
    id: 4,
    name: 'Dindigul Mutton Biryani',
    category: 'South Indian',
    price: 349,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=85',
    description: 'Iconic Tamil Nadu delicacy made with short-grain Seeraga Samba rice, tender baby mutton & mild whole spices',
    rating: '5.0',
    tag: 'Chef Signature 👑',
    color: '#fed7aa',
  },
  {
    id: 5,
    name: 'Chettinad Pepper Chicken Fry',
    category: 'South Indian',
    price: 249,
    image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=900&q=85',
    description: 'Fiery dry roast chicken tossed in freshly roasted stone-ground Chettinad pepper masala & crispy curry leaves',
    rating: '4.8',
    tag: 'Spicy Delight',
    color: '#ffe4e6',
  },
  {
    id: 6,
    name: 'Ghee Podi Roast Dosa',
    category: 'South Indian',
    price: 149,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85',
    description: 'Golden paper-thin crispy fermented rice crepe smeared with fragrant spicy gunpowder podi & pure desi ghee',
    rating: '4.9',
    tag: 'Crispy Gold',
    color: '#fef08a',
  },
  {
    id: 7,
    name: 'Paneer Butter Masala',
    category: 'Indian',
    price: 229,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85',
    description: 'Soft cottage cheese cubes simmered in a luscious creamy tomato and cashew butter gravy',
    rating: '4.9',
    tag: 'Bestseller',
    color: '#f8e9d7',
  },
  {
    id: 8,
    name: 'Margherita Pizza',
    category: 'Italian',
    price: 249,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85',
    description: 'Classic stone-baked pizza with San Marzano tomato sauce, fresh mozzarella & sweet basil',
    rating: '4.7',
    tag: '10% OFF',
    color: '#fff0dc',
  },
  {
    id: 9,
    name: 'Classic Zest Burger',
    category: 'Burgers',
    price: 199,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    description: 'Juicy patty, melted cheddar cheese, crisp iceberg lettuce and signature tangy house sauce',
    rating: '4.9',
    tag: 'Popular',
    color: '#fff0df',
  },
  {
    id: 10,
    name: 'Kumbakonam Degree Filter Coffee',
    category: 'Beverages',
    price: 59,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
    description: 'Pure chicory blend authentic South Indian decoction frothed with boiling thick whole milk in dabarah',
    rating: '4.9',
    tag: 'Authentic ☕',
    color: '#ebd5c1',
  },
  {
    id: 11,
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 149,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85',
    description: 'Warm rich molten chocolate cake with a velvety smooth gooey center',
    rating: '4.8',
    tag: 'Sweet Tooth',
    color: '#f1e8f4',
  },
]

const cuisines = [
  {
    name: 'Tamil Nadu Special',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80',
    count: 'Biryani & Parotta',
    color: '#fff1dc',
  },
  {
    name: 'South Indian',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80',
    count: 'Dosa & Kothu',
    color: '#fef3c7',
  },
  {
    name: 'North Indian',
    image: foods[6].image,
    count: 'Curries & Breads',
    color: '#fff0dc',
  },
  {
    name: 'Italian',
    image: foods[7].image,
    count: 'Pizzas & Pasta',
    color: '#e9f1df',
  },
  {
    name: 'Burgers & Quick',
    image: foods[8].image,
    count: 'Crispy Burgers',
    color: '#fff0df',
  },
]

const categories = [
  'All',
  'South Indian',
  'Indian',
  'Burgers',
  'Italian',
  'Desserts',
  'Beverages',
]

function FoodCard({
  food,
  quantity,
  favorite,
  onToggleFavorite,
  onAddToCart,
  onOpenReviews,
}: {
  food: Food
  quantity: number
  favorite: boolean
  onToggleFavorite: () => void
  onAddToCart: () => void
  onOpenReviews?: () => void
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
            {food.emoji ?? '🍽️'}
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
            <span
              className="food-rating"
              onClick={onOpenReviews}
              style={{ cursor: onOpenReviews ? 'pointer' : 'default', marginLeft: '6px' }}
              title="Click to view ratings & reviews"
            >
              ★ {food.rating} {onOpenReviews ? '💬' : ''}
            </span>
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
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null)
  const [orderError, setOrderError] = useState('')
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  // Extra Features: Coupons & Discounts
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    description: string
  } | null>(null)
  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [couponValidating, setCouponValidating] = useState(false)

  // Extra Features: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI / GPay')

  // Extra Features: Food Reviews Modal
  const [reviewModalFood, setReviewModalFood] = useState<Food | null>(null)
  const [foodReviews, setFoodReviews] = useState<any[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  // Extra Features: Admin Kitchen KDS
  const [adminOrders, setAdminOrders] = useState<any[]>([])
  const [adminStats, setAdminStats] = useState<any | null>(null)
  const [adminLoading, setAdminLoading] = useState(false)
    
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
        (section: any) =>
          (section.items ?? []).map((item: any) => {
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

  const deliveryFee = subtotal === 0 || subtotal >= 499 || appliedCoupon?.code === 'FREEDEL' ? 0 : 40
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const total = Math.max(0, subtotal + deliveryFee - discountAmount)

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

  const loadUserOrders = async () => {
    const token = localStorage.getItem('zestora_token')
    if (!token) return
    setOrdersLoading(true)
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUserOrders(await res.json())
      }
    } catch {
      // ignore
    } finally {
      setOrdersLoading(false)
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !customerEmail.trim() || !deliveryAddress.trim()) {
      setOrderError('Please enter your name, email and delivery address.')
      return
    }

    setOrderSubmitting(true)
    setOrderError('')

    try {
      let token = localStorage.getItem('zestora_token')
      if (!token) {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerName.trim(),
            email: customerEmail.trim().toLowerCase(),
            password: 'guestPassword123',
          }),
        })
        const regData = await regRes.json()
        if (regRes.ok && regData.token) {
          token = regData.token
          localStorage.setItem('zestora_token', token as string)
        } else if (regRes.status === 409) {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: customerEmail.trim().toLowerCase(),
              password: 'guestPassword123',
            }),
          })
          const loginData = await loginRes.json()
          if (loginRes.ok && loginData.token) {
            token = loginData.token
            localStorage.setItem('zestora_token', token as string)
          }
        }
      }

      if (!token) {
        throw new Error('Could not authenticate. Please check your email.')
      }

      const items = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: cart[item.id] ?? 1,
      }))

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          address: deliveryAddress.trim(),
          payment_method: paymentMethod,
          coupon_code: appliedCoupon?.code,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to place order.')
      }

      setOrderSuccess(orderData)
      setCart({})
      setAppliedCoupon(null)
    } catch (err: any) {
      setOrderError(err.message || 'Something went wrong while placing your order.')
    } finally {
      setOrderSubmitting(false)
    }
  }

  // ─── Extra Features Handlers ──────────────────────────────────────────────────

  const applyCouponCode = async (codeToTry?: string) => {
    const code = (codeToTry || couponCodeInput).trim().toUpperCase()
    if (!code) return
    setCouponValidating(true)
    setCouponMessage('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      })
      const data = await res.json()
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          description: data.description,
        })
        setCouponCodeInput('')
        setCouponMessage(`🎉 ${data.description} (Saved ₹${data.discount})`)
      } else {
        setCouponMessage(data.error || 'Invalid promo code')
      }
    } catch {
      setCouponMessage('Unable to validate promo code')
    } finally {
      setCouponValidating(false)
    }
  }

  const loadAdminData = async () => {
    setAdminLoading(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/orders'),
      ])
      if (statsRes.ok) setAdminStats(await statsRes.json())
      if (ordersRes.ok) setAdminOrders(await ordersRes.json())
    } catch {
      console.error('Failed to load admin data')
    } finally {
      setAdminLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        // Refresh local orders list
        setAdminOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        )
        setUserOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        )
      }
    } catch {
      console.error('Failed to update status')
    }
  }

  const handleOpenReviews = async (food: Food) => {
    setReviewModalFood(food)
    setReviewsLoading(true)
    setFoodReviews([])
    try {
      const res = await fetch(`/api/foods/${food.id}/reviews`)
      if (res.ok) {
        setFoodReviews(await res.json())
      }
    } catch {
      console.error('Failed to fetch reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewModalFood || !reviewText.trim()) return
    setReviewSubmitting(true)
    try {
      const res = await fetch(`/api/foods/${reviewModalFood.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: reviewAuthor.trim() || 'Verified Foodie',
          rating: reviewRating,
          comment: reviewText.trim(),
        }),
      })
      if (res.ok) {
        const newReview = await res.json()
        setFoodReviews((prev) => [newReview, ...prev])
        setReviewText('')
      }
    } catch {
      console.error('Failed to post review')
    } finally {
      setReviewSubmitting(false)
    }
  }

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
          onOpenReviews={() => handleOpenReviews(food)}
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
            className={`nav-action-button ${
              activeView === 'orders' ? 'nav-action-selected' : ''
            }`}
            onClick={() => {
              setCartOpen(false)
              setActiveView('orders')
              loadUserOrders()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>📋</span>
            <small>My Orders</small>
          </button>

          <button
            type="button"
            className={`nav-action-button ${
              activeView === 'admin' ? 'nav-action-selected' : ''
            }`}
            onClick={() => {
              setCartOpen(false)
              setActiveView('admin')
              loadAdminData()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>👨‍🍳</span>
            <small>Kitchen KDS</small>
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
          ) : activeView === 'orders' ? (
            <section className="content-section orders-container">
              <button
                type="button"
                className="text-link"
                onClick={returnHome}
              >
                ← Back to Menu
              </button>

              <div className="shopping-heading">
                <span className="eyebrow">ORDER HISTORY</span>
                <h1>My Orders</h1>
                <p>Track your recent food deliveries.</p>
              </div>

              {ordersLoading ? (
                <p>Loading your orders...</p>
              ) : userOrders.length === 0 ? (
                <div className="shopping-empty">
                  <span>📦</span>
                  <h2>No orders placed yet.</h2>
                  <p>Discover tasty food and order in seconds!</p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={returnHome}
                  >
                    Discover Dishes →
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {userOrders.map((ord: any) => (
                    <div key={ord._id} className="order-history-card">
                      <div className="order-card-header">
                        <div>
                          <strong>Order #{ord._id.slice(-6).toUpperCase()}</strong>
                          <br />
                          <small style={{ color: '#888' }}>
                            {new Date(ord.created_at).toLocaleString()}
                          </small>
                        </div>
                        <span
                          className={`order-status-badge order-status-${ord.status}`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      <div style={{ margin: '12px 0' }}>
                        {ord.items?.map((it: any, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              margin: '4px 0',
                            }}
                          >
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <strong>₹{it.subtotal || it.price * it.quantity}</strong>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          borderTop: '1px dashed #eee',
                          paddingTop: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 'bold',
                        }}
                      >
                        <span>Delivery to: {ord.address}</span>
                        <span style={{ color: 'var(--orange, #ed650e)' }}>
                          Total: ₹{ord.total}
                        </span>
                      </div>

                      {/* Live Tracker Stepper */}
                      <div className="tracker-stepper">
                        {[
                          { key: 'confirmed', label: 'Confirmed', icon: '📝' },
                          { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
                          { key: 'out_for_delivery', label: 'On The Way', icon: '🛵' },
                          { key: 'delivered', label: 'Delivered', icon: '🎉' },
                        ].map((step, sIdx) => {
                          const statusOrder = ['confirmed', 'preparing', 'out_for_delivery', 'delivered']
                          const currentIdx = statusOrder.indexOf(ord.status || 'confirmed')
                          const isDone = currentIdx >= sIdx
                          const isCurrent = currentIdx === sIdx
                          return (
                            <div
                              key={step.key}
                              className={`tracker-step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                            >
                              <div className="tracker-icon-circle">{step.icon}</div>
                              <div className="tracker-step-title">{step.label}</div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Rider Card & Live Simulation Action */}
                      {ord.status !== 'cancelled' && ord.status !== 'delivered' && (
                        <div className="rider-card">
                          <span style={{ fontSize: '1.4rem' }}>🛵</span>
                          <div style={{ flex: 1, fontSize: '0.85rem' }}>
                            <strong>Rohan Sharma is delivering your order</strong>
                            <br />
                            <small style={{ color: '#64748b' }}>
                              ETA: ~20-25 mins · Payment: {ord.payment_method || 'COD'}
                            </small>
                          </div>
                          <button
                            type="button"
                            style={{
                              background: '#ffede0',
                              color: '#ed650e',
                              border: '1px solid #ffd8c0',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const next =
                                ord.status === 'confirmed'
                                  ? 'preparing'
                                  : ord.status === 'preparing'
                                  ? 'out_for_delivery'
                                  : 'delivered'
                              updateOrderStatus(ord._id, next)
                            }}
                            title="Click to simulate live delivery progress"
                          >
                            Advance Status ⚡
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : activeView === 'admin' ? (
            <section className="content-section kds-container">
              <button
                type="button"
                className="text-link"
                onClick={returnHome}
              >
                ← Back to Menu
              </button>

              <div className="shopping-heading">
                <span className="eyebrow">RESTAURANT KITCHEN DISPLAY</span>
                <h1>Kitchen KDS & Live Analytics</h1>
                <p>Real-time order fulfillment & kitchen management dashboard.</p>
              </div>

              {adminLoading ? (
                <p>Loading kitchen metrics...</p>
              ) : (
                <>
                  <div className="kds-stats-grid">
                    <div className="kds-stat-card">
                      <div className="kds-stat-label">Total Revenue</div>
                      <div className="kds-stat-val" style={{ color: '#10b981' }}>
                        ₹{adminStats?.total_revenue ?? 0}
                      </div>
                    </div>
                    <div className="kds-stat-card">
                      <div className="kds-stat-label">Total Orders</div>
                      <div className="kds-stat-val">
                        {adminStats?.total_orders ?? 0}
                      </div>
                    </div>
                    <div className="kds-stat-card">
                      <div className="kds-stat-label">Active In Kitchen</div>
                      <div className="kds-stat-val" style={{ color: '#ed650e' }}>
                        {adminStats?.active_orders ?? 0}
                      </div>
                    </div>
                    <div className="kds-stat-card">
                      <div className="kds-stat-label">Menu Items</div>
                      <div className="kds-stat-val">
                        {adminStats?.total_foods ?? foods.length}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2>Live Incoming Orders ({adminOrders.length})</h2>
                    <button
                      type="button"
                      className="primary-button"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      onClick={loadAdminData}
                    >
                      🔄 Refresh Kitchen
                    </button>
                  </div>

                  {adminOrders.length === 0 ? (
                    <div className="shopping-empty">
                      <span>🍳</span>
                      <h2>No orders in kitchen queue.</h2>
                      <p>Orders placed by customers will appear here in real time.</p>
                    </div>
                  ) : (
                    <div className="kds-orders-grid">
                      {adminOrders.map((ord: any) => (
                        <div key={ord._id} className={`kds-order-card status-${ord.status}`}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ fontSize: '1.05rem' }}>
                                #{ord._id.slice(-6).toUpperCase()}
                              </strong>
                              <span className={`order-status-badge order-status-${ord.status}`}>
                                {ord.status}
                              </span>
                            </div>
                            <small style={{ color: '#78716c' }}>
                              {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {ord.payment_method || 'COD'}
                            </small>
                            <p style={{ margin: '8px 0', fontSize: '0.9rem', color: '#444' }}>
                              📍 {ord.address}
                            </p>

                            <div style={{ borderTop: '1px solid #f1e9df', margin: '8px 0', paddingTop: '8px' }}>
                              {ord.items?.map((it: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '3px 0' }}>
                                  <span>{it.quantity}x {it.name}</span>
                                  <strong>₹{it.subtotal || it.price * it.quantity}</strong>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: '8px', fontSize: '1rem', color: '#ed650e' }}>
                              <span>Total:</span>
                              <span>₹{ord.total}</span>
                            </div>

                            <div className="kds-actions">
                              {ord.status === 'confirmed' && (
                                <button
                                  type="button"
                                  className="kds-btn kds-btn-prepare"
                                  onClick={() => updateOrderStatus(ord._id, 'preparing')}
                                >
                                  🍳 Start Cooking
                                </button>
                              )}
                              {ord.status === 'preparing' && (
                                <button
                                  type="button"
                                  className="kds-btn kds-btn-dispatch"
                                  onClick={() => updateOrderStatus(ord._id, 'out_for_delivery')}
                                >
                                  🛵 Dispatch Rider
                                </button>
                              )}
                              {ord.status === 'out_for_delivery' && (
                                <button
                                  type="button"
                                  className="kds-btn kds-btn-deliver"
                                  onClick={() => updateOrderStatus(ord._id, 'delivered')}
                                >
                                  ✅ Mark Delivered
                                </button>
                              )}
                              {ord.status === 'delivered' && (
                                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, padding: '8px 0' }}>
                                  Order Completed 🎉
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
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

                  {discountAmount > 0 && (
                    <p style={{ color: '#10b981' }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <strong>- ₹{discountAmount}</strong>
                    </p>
                  )}

                  {/* Promo Coupons Section */}
                  <div className="promo-section">
                    <div className="promo-header">
                      <span>🏷️ Promo Discount Code</span>
                    </div>
                    {appliedCoupon ? (
                      <div className="promo-applied-tag">
                        <span>✓ {appliedCoupon.code} applied!</span>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setAppliedCoupon(null)
                            setCouponMessage('')
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="promo-input-group">
                          <input
                            type="text"
                            placeholder="e.g. AWS20"
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value)}
                          />
                          <button
                            type="button"
                            className="primary-button"
                            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                            onClick={() => applyCouponCode()}
                            disabled={couponValidating}
                          >
                            {couponValidating ? '...' : 'Apply'}
                          </button>
                        </div>
                        {couponMessage && (
                          <small
                            style={{
                              color: couponMessage.includes('Invalid') ? '#dc2626' : '#10b981',
                              display: 'block',
                              marginTop: '6px',
                              fontWeight: 600,
                            }}
                          >
                            {couponMessage}
                          </small>
                        )}
                        <div className="promo-pills">
                          <span className="promo-pill" onClick={() => applyCouponCode('AWS20')}>
                            AWS20 (20% OFF)
                          </span>
                          <span className="promo-pill" onClick={() => applyCouponCode('CLOUD50')}>
                            CLOUD50 (₹50 OFF)
                          </span>
                          <span className="promo-pill" onClick={() => applyCouponCode('FREEDEL')}>
                            FREEDEL (Free Del)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

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
                    onClick={() => {
                      setCartOpen(false)
                      setCheckoutOpen(true)
                      setOrderSuccess(null)
                      setOrderError('')
                    }}
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

      {checkoutOpen && (
        <div
          className="checkout-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !orderSubmitting) {
              setCheckoutOpen(false)
            }
          }}
        >
          <div className="checkout-modal" role="dialog" aria-modal="true">
            <div className="checkout-header">
              <h2>{orderSuccess ? 'Order Confirmed! 🎉' : 'Checkout & Delivery'}</h2>
              <button
                type="button"
                className="checkout-close"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close checkout"
              >
                ×
              </button>
            </div>

            {orderSuccess ? (
              <div className="checkout-success-view">
                <div className="success-badge">✓</div>
                <h3>Thank you, {customerName}!</h3>
                <p>Your meal is being prepared with love.</p>
                <div className="order-badge-id">
                  Order ID: <strong>{orderSuccess._id}</strong>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Delivering to: <strong>{orderSuccess.address}</strong>
                </p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      setCheckoutOpen(false)
                      setActiveView('orders')
                      loadUserOrders()
                    }}
                  >
                    View My Orders
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setCheckoutOpen(false)
                      returnHome()
                    }}
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder}>
                {orderError && <div className="checkout-error">{orderError}</div>}

                <div className="form-group">
                  <label htmlFor="customer-name">Full Name</label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="e.g. Alice Test"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer-email">Email Address</label>
                  <input
                    id="customer-email"
                    type="email"
                    required
                    placeholder="e.g. alice@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="delivery-address">Delivery Address</label>
                  <textarea
                    id="delivery-address"
                    rows={3}
                    required
                    placeholder="e.g. Apt 4B, 123 Baker Street, City"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Select Payment Method</label>
                  <div className="payment-method-selector">
                    {[
                      { id: 'UPI / GPay', label: '⚡ UPI / Google Pay / PhonePe', desc: 'Instant & Secure' },
                      { id: 'Cash on Delivery', label: '💵 Cash on Delivery (COD)', desc: 'Pay when food arrives' },
                      { id: 'Credit / Debit Card', label: '💳 Credit / Debit Card', desc: 'Visa, MasterCard, RuPay' },
                    ].map((m) => (
                      <div
                        key={m.id}
                        className={`payment-method-option ${paymentMethod === m.id ? 'is-selected' : ''}`}
                        onClick={() => setPaymentMethod(m.id)}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === m.id}
                          onChange={() => setPaymentMethod(m.id)}
                        />
                        <div>
                          <div>{m.label}</div>
                          <small style={{ color: '#888' }}>{m.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="checkout-summary-box">
                  <div className="checkout-summary-row">
                    <span>Items ({cartCount})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="checkout-summary-row" style={{ color: '#10b981', fontWeight: 700 }}>
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="checkout-summary-row total">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                  disabled={orderSubmitting || cartItems.length === 0}
                >
                  {orderSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${total})`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─── Food Reviews & Ratings Modal ────────────────────────────────────────── */}
      {reviewModalFood && (
        <div
          className="review-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !reviewSubmitting) {
              setReviewModalFood(null)
            }
          }}
        >
          <div className="review-modal" role="dialog" aria-modal="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="eyebrow">{reviewModalFood.category}</span>
                <h2 style={{ margin: '4px 0' }}>{reviewModalFood.name}</h2>
              </div>
              <button
                type="button"
                className="checkout-close"
                onClick={() => setReviewModalFood(null)}
              >
                ×
              </button>
            </div>

            <p style={{ color: '#666', margin: '8px 0 16px' }}>
              {reviewModalFood.description} · <strong style={{ color: '#ed650e' }}>₹{reviewModalFood.price}</strong>
            </p>

            <div style={{ borderTop: '1px solid #f1e9df', paddingTop: '16px' }}>
              <h3>Customer Reviews & Ratings ({foodReviews.length})</h3>

              {reviewsLoading ? (
                <p>Loading customer reviews...</p>
              ) : foodReviews.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', margin: '12px 0' }}>
                  No customer reviews yet. Be the first food critic to share your review!
                </p>
              ) : (
                <div className="reviews-list">
                  {foodReviews.map((r: any, idx: number) => (
                    <div key={idx} className="review-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{r.user_name}</strong>
                        <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating || 5)}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', color: '#444', fontSize: '0.92rem' }}>
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Review Form */}
              <form onSubmit={handleSubmitReview} style={{ marginTop: '20px', background: '#faf5ee', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 10px' }}>Leave a Review</h4>

                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="star-rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= reviewRating ? 'is-active' : ''}
                        onClick={() => setReviewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-author">Your Name</label>
                  <input
                    id="review-author"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-text">Review Comment</label>
                  <textarea
                    id="review-text"
                    rows={2}
                    placeholder="Taste, portion size, delivery experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="primary-button"
                  style={{ width: '100%', marginTop: '10px' }}
                  disabled={reviewSubmitting || !reviewText.trim()}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review ⭐'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
