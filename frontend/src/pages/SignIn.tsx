
import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="auth-brand">
          Zestora<span>.</span>
        </Link>

        <div className="auth-visual-content">
          <span className="auth-eyebrow">A LITTLE TASTE OF HAPPINESS</span>
          <h1>
            Good food.
            <br />
            Good mood.
          </h1>
          <p>
            Discover your next favourite meal.
            Delicious moments are just a few clicks away.
          </p>
        </div>

        <div className="auth-visual-footer">
          MADE WITH LOVE, SERVED WITH FLAVOUR.
        </div>
      </section>

      <section className="auth-form-side">
        <Link to="/" className="auth-back">
          ← Back to home
        </Link>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span className="auth-kicker">YOUR TABLE IS WAITING</span>
            <h2>Welcome back</h2>
            <p>Sign in to continue your Zestora journey.</p>
          </div>

          <form
            className="auth-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <div className="auth-password-label">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="auth-text-button"
                onClick={() =>
                  alert("Password recovery will be available after backend integration.")
                }
              >
                Forgot password?
              </button>
            </div>

            <div className="auth-password-input">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-show-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="auth-primary-button">
              Sign in <span>→</span>
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
            onClick={() =>
              alert("Google sign-in will be connected after OAuth setup.")
            }
          >
            <span className="auth-google-g" aria-hidden="true">G</span>
            Continue with Google
          </button>

          <p className="auth-switch">
            New to Zestora? <Link to="/signup">Create account</Link>
          </p>
        </div>

        <p className="auth-terms">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
