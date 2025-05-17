import {useState, useEffect, useRef} from "react";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [followerPosition, setFollowerPosition] = useState({x: 0, y: 0});
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const emojiContainerRef = useRef(null);

  // Mouse tracking for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({x: e.clientX, y: e.clientY});
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate follower cursor
  useEffect(() => {
    const animateFollower = () => {
      setFollowerPosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(animateFollower);
    };
    animateFollower();
  }, [mousePosition]);

  // Floating emojis
  useEffect(() => {
    const emojis = ["💔", "😎", "😭", "🔥", "🍷", "🫠", "🧨", "🎤", "🚪"];

    const createFloatingEmoji = () => {
      if (!emojiContainerRef.current) return;

      const emoji = document.createElement("div");
      emoji.className = "floating-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = Math.random() * 100 + "vw";
      emoji.style.animationDuration = Math.random() * 8 + 10 + "s";
      emoji.style.animationDelay = Math.random() * 2 + "s";

      emoji.addEventListener("mouseenter", () => {
        emoji.style.transform = "scale(1.5) rotate(180deg)";
        emoji.style.opacity = "1";
      });

      emoji.addEventListener("mouseleave", () => {
        emoji.style.transform = "scale(1) rotate(0deg)";
        emoji.style.opacity = "0.6";
      });

      emojiContainerRef.current.appendChild(emoji);

      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.remove();
        }
      }, 20000);
    };

    // Initialize emojis
    for (let i = 0; i < 8; i++) {
      setTimeout(createFloatingEmoji, i * 200);
    }

    const emojiInterval = setInterval(createFloatingEmoji, 1500);
    return () => clearInterval(emojiInterval);
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll(".shape");
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        shape.style.transform = `translate(${xAxis * speed}px, ${
          yAxis * speed
        }px)`;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate login - in real app, validate credentials here
    const userData = {
      email: formData.email,
      password: formData.password
    };

    localStorage.setItem('theend_user', JSON.stringify(userData));
    setLoading(false);
    onSignIn(userData);
  };

  const handleFocus = (e) => {
    const wrapper = e.target.closest(".input-wrapper");
    if (wrapper) {
      wrapper.style.boxShadow = "0 0 25px rgba(255, 71, 87, 0.3)";
      wrapper.style.transform = "translateY(-2px)";
    }
  };

  const handleBlur = (e) => {
    const wrapper = e.target.closest(".input-wrapper");
    if (wrapper) {
      wrapper.style.boxShadow = "none";
      wrapper.style.transform = "translateY(0)";
    }
  };

  const handleInteractiveHover = (scale) => {
    if (cursorRef.current && followerRef.current) {
      cursorRef.current.style.transform = `scale(${scale})`;
      followerRef.current.style.transform = `scale(${scale === 1.5 ? 1.2 : 1})`;
    }
  };

  return (
    <div style={{cursor: "none"}}>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap");

        :root {
          --primary-red: #ff4757;
          --primary-yellow: #ffd32a;
          --primary-purple: #a855f7;
          --dark-bg: #0f0f12;
          --glass-bg: rgba(255, 255, 255, 0.03);
          --glass-border: rgba(255, 255, 255, 0.08);
          --text-primary: #ffffff;
          --text-secondary: rgba(255, 255, 255, 0.7);
          --shadow-light: rgba(255, 71, 87, 0.3);
          --shadow-dark: rgba(0, 0, 0, 0.5);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", sans-serif;
          background: var(--dark-bg);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, var(--primary-red), transparent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s ease;
        }

        .cursor-follower {
          position: fixed;
          width: 40px;
          height: 40px;
          background: radial-gradient(
            circle,
            rgba(255, 71, 87, 0.2),
            transparent
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.3s ease;
        }

        .bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          background: radial-gradient(
            ellipse at center,
            #1a1a2e 0%,
            #0f0f12 70%
          );
        }

        .bg-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          animation: float-shapes 20s infinite linear;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle,
            rgba(255, 71, 87, 0.1),
            transparent
          );
          top: 20%;
          left: -10%;
          animation-duration: 25s;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.1),
            transparent
          );
          top: 60%;
          right: -10%;
          animation-duration: 30s;
          animation-direction: reverse;
        }

        .shape-3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle,
            rgba(255, 211, 42, 0.05),
            transparent
          );
          top: -20%;
          right: 20%;
          animation-duration: 35s;
        }

        @keyframes float-shapes {
          0%,
          100% {
            transform: rotate(0deg) translate(0px) rotate(0deg);
          }
          25% {
            transform: rotate(90deg) translate(50px) rotate(-90deg);
          }
          50% {
            transform: rotate(180deg) translate(0px) rotate(-180deg);
          }
          75% {
            transform: rotate(270deg) translate(-50px) rotate(-270deg);
          }
        }

        .emoji-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 2;
        }

        .floating-emoji {
          position: absolute;
          font-size: 3rem;
          opacity: 0;
          transition: all 0.3s ease;
          animation: float-emoji 12s linear infinite;
        }

        @keyframes float-emoji {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
            transform: scale(1);
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }

        .main-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .content-wrapper {
          display: flex;
          gap: 4rem;
          max-width: 1200px;
          width: 100%;
          align-items: center;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--glass-bg);
          backdrop-filter: blur(25px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          transform: perspective(1000px) rotateX(5deg) rotateY(-5deg);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 25px 50px var(--shadow-dark),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .auth-card:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg)
            translateY(-10px);
          box-shadow: 0 35px 70px var(--shadow-dark),
            0 0 50px var(--shadow-light), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .auth-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--primary-red),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .brand-section {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          font-family: "Clash Display", sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(
            135deg,
            var(--primary-red),
            var(--primary-yellow)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          animation: gradient-shift 3s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .page-title {
          font-family: "Clash Display", sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .tagline {
          color: var(--text-secondary);
          font-style: italic;
          font-size: 0.9rem;
          opacity: 0;
          animation: fadeInUp 1s ease 0.5s forwards;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .form-container {
          margin-top: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          position: relative;
        }

        .form-label {
          display: block;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .input-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-red);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 20px rgba(255, 71, 87, 0.2);
        }

        .input-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 71, 87, 0.1),
            transparent
          );
          transition: left 0.5s ease;
          z-index: 1;
        }

        .form-input:focus + .input-wrapper::after {
          left: 100%;
        }

        .forgot-link {
          text-align: right;
          margin-bottom: 1.5rem;
        }

        .forgot-link a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .forgot-link a:hover {
          color: var(--primary-red);
        }

        .submit-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(
            135deg,
            var(--primary-red),
            var(--primary-yellow)
          );
          border: none;
          border-radius: 12px;
          color: #000;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .submit-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            var(--primary-yellow),
            var(--primary-red)
          );
          transition: left 0.3s ease;
          z-index: 1;
        }

        .submit-btn:hover::before {
          left: 0;
        }

        .submit-btn span {
          position: relative;
          z-index: 2;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(255, 71, 87, 0.4);
        }

        .submit-btn.loading::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: loading-shimmer 1.5s infinite;
        }

        @keyframes loading-shimmer {
          100% {
            left: 100%;
          }
        }

        .social-section {
          margin-top: 1.5rem;
        }

        .divider {
          text-align: center;
          position: relative;
          margin: 1.5rem 0;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .divider::before,
        .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
        }

        .divider::before {
          left: 0;
        }
        .divider::after {
          right: 0;
        }

        .social-buttons {
          display: flex;
          gap: 1rem;
        }

        .social-btn {
          flex: 1;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          position: relative;
          overflow: hidden;
        }

        .social-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .social-btn:hover::before {
          opacity: 1;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .auth-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-link a {
          color: var(--primary-red);
          text-decoration: none;
          font-weight: 600;
          position: relative;
        }

        .auth-link a::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            135deg,
            var(--primary-red),
            var(--primary-yellow)
          );
          transition: width 0.3s ease;
        }

        .auth-link a:hover::after {
          width: 100%;
        }

        .showcase-section {
          flex: 1;
          max-width: 500px;
          padding: 2rem;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.01)
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          position: relative;
          transform: perspective(1000px) rotateX(-5deg) rotateY(5deg);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .showcase-section:hover {
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg)
            translateY(-10px);
        }

        .showcase-title {
          font-family: "Clash Display", sans-serif;
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ffffff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .showcase-subtitle {
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .examples-grid {
          display: grid;
          gap: 1rem;
        }

        .example-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .example-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 71, 87, 0.05),
            transparent
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .example-card:hover::before {
          opacity: 1;
        }

        .example-card:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-5px) translateX(5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 71, 87, 0.3);
        }

        .example-title {
          color: var(--primary-yellow);
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .example-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
            gap: 2rem;
          }

          .auth-card,
          .showcase-section {
            transform: none;
            max-width: 100%;
          }

          .auth-card:hover,
          .showcase-section:hover {
            transform: translateY(-5px);
          }

          .main-container {
            padding: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="cursor"
        style={{left: mousePosition.x + "px", top: mousePosition.y + "px"}}
      />
      <div
        ref={followerRef}
        className="cursor-follower"
        style={{
          left: followerPosition.x + "px",
          top: followerPosition.y + "px",
        }}
      />

      {/* Background */}
      <div className="bg-container">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Floating Emojis */}
      <div ref={emojiContainerRef} className="emoji-container"></div>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-wrapper">
          {/* Login Card */}
          <div className="auth-card">
            <div className="brand-section">
              <div className="logo">TheEnd.page</div>
              <h1 className="page-title">Welcome Back</h1>
              <p className="tagline">
                If you're going to leave, at least log in first.
              </p>
            </div>

            <div className="form-container">
              <div onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="loginEmail">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="loginEmail"
                      className="form-input"
                      placeholder="your.final@goodbye.com"
                      required
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      id="loginPassword"
                      className="form-input"
                      placeholder="••••••••••••"
                      required
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className="forgot-link">
                  <a href="#">Forgot your password?</a>
                </div>

                <button
                  onClick={handleSubmit}
                  className={`submit-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Signing you in..." : "Sign Me In"}</span>
                </button>
              </div>

              <div className="social-section">
                <div className="divider">or continue with</div>

                <div className="social-buttons">
                  <button
                    className="social-btn"
                    onMouseEnter={() => handleInteractiveHover(1.5)}
                    onMouseLeave={() => handleInteractiveHover(1)}
                  >
                    <span>🔥</span>
                    <span>Google</span>
                  </button>
                  <button
                    className="social-btn"
                    onMouseEnter={() => handleInteractiveHover(1.5)}
                    onMouseLeave={() => handleInteractiveHover(1)}
                  >
                    <span>😎</span>
                    <span>Apple</span>
                  </button>
                </div>
              </div>

              <div className="auth-link">
                Don't have an account? <a href="#signup">Join the drama</a>
              </div>
            </div>
          </div>

          {/* Showcase Section */}
          <div className="showcase-section">
            <h2 className="showcase-title">Goodbye Pages Done Right</h2>
            <p className="showcase-subtitle">
              See how others have made their dramatic exits with style and
              substance.
            </p>

            <div className="examples-grid">
              <div
                className="example-card"
                onMouseEnter={() => handleInteractiveHover(1.5)}
                onMouseLeave={() => handleInteractiveHover(1)}
              >
                <div className="example-title">
                  💔 The Heartbreak Chronicles
                </div>
                <div className="example-desc">
                  Sarah's viral farewell to social media turned personal pain
                  into universal poetry, reaching 2M+ readers.
                </div>
              </div>

              <div
                className="example-card"
                onMouseEnter={() => handleInteractiveHover(1.5)}
                onMouseLeave={() => handleInteractiveHover(1)}
              >
                <div className="example-title">🔥 Corporate Exodus</div>
                <div className="example-desc">
                  Marcus documented his burnout journey with receipts, sass, and
                  actionable advice for fellow escapees.
                </div>
              </div>

              <div
                className="example-card"
                onMouseEnter={() => handleInteractiveHover(1.5)}
                onMouseLeave={() => handleInteractiveHover(1)}
              >
                <div className="example-title">🫠 Quarter-Life Manifesto</div>
                <div className="example-desc">
                  Alex's existential crisis became a movement, inspiring
                  thousands to question their life choices.
                </div>
              </div>

              <div
                className="example-card"
                onMouseEnter={() => handleInteractiveHover(1.5)}
                onMouseLeave={() => handleInteractiveHover(1)}
              >
                <div className="example-title">🎤 Industry Mic Drop</div>
                <div className="example-desc">
                  The resignation letter that exposed toxic culture and changed
                  an entire industry's conversation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
