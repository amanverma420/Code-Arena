import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [_focusedInput, setFocusedInput] = useState("");
  const [_isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    });

    const msg = await res.json();

    console.log("Response from server:", msg);

    if (msg.message === "Authenticated") {
      navigate("/lobby", { state: { user: msg.user[0] } });
    } else {
      alert("Login Failed");
    }

    console.log("Login data:", formData);
  };

  return (
    <div className="login-container">
      <div className="sparkle"></div>
      <div className="sparkle"></div>
      <div className="sparkle"></div>
      <div className="sparkle"></div>
      <div className="sparkle"></div>

      <style>
        {`
          /* --- Base Styles & Fonts --- */
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden; /* Hide scrollbars from animated elements */
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* --- Global Animations --- */

          .login-container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 20px;
            position: relative;
            overflow: hidden; /* Contain particles */
            /* Animated Gradient Background */
            background: linear-gradient(135deg, #667eea, #764ba2, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }

          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          /* Particle System */
          .sparkle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            animation: sparkle-animation 10s linear infinite;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px white;
          }

          .sparkle:nth-child(1) { width: 8px; height: 8px; left: 10%; top: 20%; animation-duration: 12s; }
          .sparkle:nth-child(2) { width: 5px; height: 5px; left: 80%; top: 30%; animation-duration: 9s; animation-delay: 2s; }
          .sparkle:nth-child(3) { width: 10px; height: 10px; left: 30%; top: 70%; animation-duration: 15s; animation-delay: 4s; }
          .sparkle:nth-child(4) { width: 6px; height: 6px; left: 50%; top: 90%; animation-duration: 8s; }
          .sparkle:nth-child(5) { width: 7px; height: 7px; left: 90%; top: 10%; animation-duration: 11s; animation-delay: 3s; }

          @keyframes sparkle-animation {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }


          /* --- Login Card & Content --- */

          .login-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 24px;
            padding: 50px 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            /* Fade-in Effect */
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .logo-section {
            text-align: center;
            margin-bottom: 40px;
          }

          .logo-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 32px;
            color: white;
            font-weight: bold;
            animation: neonPulse 2s infinite alternate, float 6s ease-in-out infinite;
            transition: transform 0.3s ease;
            position: relative;
            text-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 1;
            /* Ensure text is visible */
            -webkit-text-fill-color: white;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
          }
          
          .logo-icon:hover {
            transform: rotate(15deg) scale(1.1);
          }

          @keyframes neonPulse {
            from { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #667eea, 0 0 40px #667eea; }
            to { box-shadow: 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #764ba2, 0 0 50px #764ba2; }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          .login-title {
            font-size: 32px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
            margin-top: 0;
          }

          .login-subtitle {
            font-size: 16px;
            color: #718096;
            margin: 0;
          }

          .form-group {
            margin-bottom: 24px;
          }

          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
          }

          .form-input {
            width: 100%;
            padding: 14px 16px;
            font-size: 15px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            outline: none;
            transition: all 0.3s ease;
            font-family: inherit;
            background: #f7fafc;
            color:black;
          }

          .form-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
            background: white;
          }

          .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 20px;
          }

          .checkbox-group input[type="checkbox"] {
            cursor: pointer;
            accent-color: #667eea;
            width: 16px;
            height: 16px;
          }

          .checkbox-group label {
            cursor: pointer;
            margin: 0;
          }

          /* --- Button Animations --- */
          
          .btn {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            z-index: 1;
          }

          /* Shimmer Effect */
          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transform: skewX(-25deg);
            transition: left 0.7s ease;
          }
          
          .btn:hover::before {
            left: 150%;
          }

          /* Ripple Effect */
           .btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
          }

          @keyframes ripple {
            0% { transform: scale(0, 0); opacity: 1; }
            20% { transform: scale(25, 25); opacity: 1; }
            100% { opacity: 0; transform: scale(40, 40); }
          }
          
          .btn:focus:not(:active)::after {
            animation: ripple 1s ease-out;
          }


          .btn-primary {
            width: 100%;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            margin-top: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .btn-primary:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
          }

          .divider {
            display: flex;
            align-items: center;
            margin: 32px 0;
            color: #a0aec0;
            font-size: 14px;
          }

          .divider-line {
            flex: 1;
            height: 1px;
            background: #e2e8f0;
          }

          .divider-text {
            padding: 0 16px;
            color: black;
          }

          .social-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .social-btn {
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
          }

          .social-btn:hover {
            border-color: #cbd5e0;
            background: #f7fafc;
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          }
          
          .social-btn svg {
            transition: transform 0.3s ease;
          }

          .social-btn:hover svg {
            transform: rotate(-5deg) scale(1.1);
          }

          .footer-text {
            text-align: center;
            margin-top: 28px;
            font-size: 14px;
            color: #718096;
          }

          .footer-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            cursor: pointer;
            position: relative;
          }

          .footer-link::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: #764ba2;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
          }

          .footer-link:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
          

          /* --- Responsive Design --- */
          @media (max-width: 480px) {
            .login-card {
              padding: 32px 20px;
              border-radius: 20px;
            }

            // .logo-icon {
            //   width: 60px;
            //   height: 60px;
            // }

            .login-title {
              font-size: 28px;
            }

            .social-buttons {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon">{"</>"}</div>
          <h1 className="login-title">CodeArena</h1>
          <p className="login-subtitle">Battle. Code. Conquer.</p>
        </div>

        <div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput("")}
              className="form-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput("")}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {/* <div className="checkbox-group">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              id="remember"
            />
            <label htmlFor="remember">Remember me</label>
          </div> */}

          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign In
          </button>
        </div>

        {/* <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or continue with</span>
          <div className="divider-line"></div>
        </div>

        <div className="social-buttons">
          <button className="btn social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button className="btn social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.91 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.59-2.805 5.61-5.475 5.91.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div> */}

        <div className="footer-text">
          Don't have an account?{" "}
          <a
            className="footer-link"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
            href="#"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
