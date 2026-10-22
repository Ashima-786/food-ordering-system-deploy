
import { Link } from "react-router-dom";
import "./SignIn.css";

export default function SignUp() {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="auth-brand">
          Zestora<span>.</span>
        </Link>

        <div className="auth-visual-content">
          <span className="auth-eyebrow">GOOD FOOD STARTS HERE</span>
          <h1>
            Your table.
            <br />
            Your favourites.
          </h1>
          <p>Create your account and make every craving count.</p>
        </div>

        <div className="auth-visual-footer">
          MADE WITH LOVE, SERVED WITH FLAVOUR.
        </div>
      </section>

      <section className="auth-form-side">
        <Link to="/" className="auth-back">← Back to home</Link>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker">JOIN THE ZESTORA TABLE</span>
            <h2>Create account</h2>
            <p>Set up your account to get started.</p>
          </div>

          <form
            className="auth-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" placeholder="Your name" autoComplete="name" required />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <button type="submit" className="auth-primary-button">
              Create account <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>OR</p>
            <span />
          </div>

          <button
            type="button"
            className="auth-google-button"
            onClick={() => alert("Google sign-up will be connected after OAuth setup.")}
          >
            <span className="auth-google-g" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
