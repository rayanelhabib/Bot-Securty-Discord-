<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Safety Bot - بوت الأمان</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
  /* CSS Variables for Ultra Beautiful Green Theme */
  :root {
    --primary-gradient: linear-gradient(135deg, #4caf50 0%, #2e7d32 30%, #1b5e20 60%, #0d4a14 90%, #2e7d32 100%);
    --secondary-gradient: linear-gradient(135deg, #66bb6a 0%, #4caf50 30%, #388e3c 60%, #2e7d32 90%, #66bb6a 100%);
    --accent-gradient: linear-gradient(135deg, #81c784 0%, #66bb6a 30%, #4caf50 60%, #388e3c 90%, #81c784 100%);
    --success-gradient: linear-gradient(135deg, #a5d6a7 0%, #81c784 30%, #66bb6a 60%, #4caf50 90%, #a5d6a7 100%);
    --warning-gradient: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 30%, #81c784 60%, #66bb6a 90%, #c8e6c9 100%);
    --green-gradient: linear-gradient(45deg, #4caf50, #66bb6a, #81c784, #a5d6a7, #c8e6c9, #a5d6a7, #81c784, #66bb6a, #4caf50);
    --dark-bg: #0a0a0a;
    --darker-bg: #050505;
    --card-bg: rgba(76, 175, 80, 0.08);
    --glass-bg: rgba(76, 175, 80, 0.15);
    --text-primary: #ffffff;
    --text-secondary: #b8b8b8;
    --text-muted: #888888;
    --border-color: rgba(76, 175, 80, 0.3);
    --shadow-light: 0 8px 32px rgba(0, 0, 0, 0.4);
    --shadow-heavy: 0 20px 60px rgba(0, 0, 0, 0.6);
    --shadow-ultra: 0 30px 90px rgba(0, 0, 0, 0.8);
    --shadow-expert: 0 40px 120px rgba(0, 0, 0, 0.9);
    --shadow-4d: 0 50px 150px rgba(0, 0, 0, 1);
    --glow-primary: 0 0 40px rgba(76, 175, 80, 0.6);
    --glow-success: 0 0 40px rgba(102, 187, 106, 0.6);
    --glow-green: 0 0 50px rgba(76, 175, 80, 0.5);
    --glow-expert: 0 0 60px rgba(76, 175, 80, 0.6);
    --glow-4d: 0 0 70px rgba(76, 175, 80, 0.7);
    --perspective: 1000px;
    --perspective-origin: 50% 50%;
    --transform-origin: center center;
    --timing-ultra: cubic-bezier(0.19, 1, 0.22, 1);
    --timing-4d: cubic-bezier(0.16, 1, 0.3, 1);
    --timing-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --timing-ultra-smooth: cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* Advanced Reset & Base Styles */
  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

  /* DISABLED CUSTOM CURSOR - NO LAG */
  body {
    cursor: default;
  }

  html {
    scroll-behavior: auto; /* Changed to auto for better performance */
    overflow-x: hidden;
  }

  /* ULTRA-SMOOTH SCROLL OPTIMIZATION */
  * {
    scroll-behavior: auto; /* Disable smooth scroll for better performance */
  }

  /* Optimize scroll performance */
  body {
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }

  body { 
    font-family: 'Inter', 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--dark-bg);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    position: relative;
    perspective: var(--perspective);
    perspective-origin: var(--perspective-origin);
    transform-style: preserve-3d;
    will-change: transform;
  }

  /* Green Animated Background */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(76, 175, 80, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(102, 187, 106, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(129, 199, 132, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 60% 60%, rgba(165, 214, 167, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, var(--dark-bg) 0%, var(--darker-bg) 100%);
    z-index: -2;
    animation: backgroundShift 20s ease-in-out infinite, backgroundPulse 8s ease-in-out infinite;
  }

  body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      conic-gradient(from 0deg at 50% 50%, 
        transparent 0deg, 
        rgba(76, 175, 80, 0.08) 60deg, 
        transparent 120deg,
        rgba(102, 187, 106, 0.08) 180deg,
        transparent 240deg,
        rgba(129, 199, 132, 0.08) 300deg,
        transparent 360deg
      );
    z-index: -1;
    animation: rotate 30s linear infinite;
    opacity: 0.4;
  }

  /* Floating Particles */
  .particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 15s infinite linear;
  }
  /* Glassmorphism Header */
  header { 
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    box-shadow: var(--shadow-light);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  header.scrolled {
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }

  header .logo { 
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  header .logo::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: var(--primary-gradient);
    border-radius: 50%;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  header .logo:hover::before {
    opacity: 0.2;
  }

  header .logo img { 
    width: 70px;
    height: 70px;
    animation: logoFloat 6s ease-in-out infinite, logoGlow 3s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.8)) drop-shadow(0 0 60px rgba(76, 175, 80, 0.4)) brightness(1.1) saturate(1.2);
    transition: all 0.6s var(--timing-4d);
    transform-style: preserve-3d;
    position: relative;
  }

  header .logo img::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.6s ease;
    z-index: -1;
    animation: logoAura 4s ease-in-out infinite;
  }

  header .logo:hover img {
    transform: scale(1.1) rotateY(10deg) rotateX(5deg);
    filter: drop-shadow(0 0 40px rgba(76, 175, 80, 1)) drop-shadow(0 0 80px rgba(76, 175, 80, 0.6)) brightness(1.2) saturate(1.4);
  }

  header .logo:hover img::before {
    opacity: 1;
    transform: scale(1.3);
  }

  header .logo h1 { 
    font-size: 2.2rem;
    font-weight: 900;
    background: var(--green-gradient);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: -0.02em;
    animation: greenPulse 4s ease-in-out infinite, logoGlow 3s ease-in-out infinite alternate;
    transition: all 0.6s var(--timing-4d);
    text-shadow: 
      0 0 20px rgba(76, 175, 80, 0.8),
      0 0 40px rgba(76, 175, 80, 0.6),
      0 0 60px rgba(76, 175, 80, 0.4);
    transform-style: preserve-3d;
    position: relative;
  }

  header .logo h1::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(76, 175, 80, 0.4), rgba(102, 187, 106, 0.4), rgba(129, 199, 132, 0.4));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateZ(-8px) scale(1.08);
    transition: all 0.6s ease;
    animation: logoShadow 4s ease-in-out infinite;
  }

  header .logo:hover h1 {
    transform: translateZ(5px) scale(1.05);
    filter: brightness(1.2) saturate(1.3);
  }

  header .logo:hover h1::before {
    opacity: 1;
    transform: translateZ(0) scale(1);
  }

  .lang-toggle { 
    background: var(--primary-gradient);
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-light);
  }

  .lang-toggle::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  .lang-toggle:hover::before {
    left: 100%;
  }

  .lang-toggle:hover, .lang-toggle:focus { 
    transform: translateY(-2px);
    box-shadow: var(--shadow-heavy);
    outline: none;
  }
  /* Main Content */
  main { 
    flex: 1;
    padding: 8rem 2rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    position: relative;
  }

  /* Hero Section */
  .intro { 
    text-align: center;
    margin-bottom: 6rem;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .intro.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  .intro::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 300px;
    background: var(--primary-gradient);
    border-radius: 50%;
    opacity: 0.1;
    filter: blur(100px);
    animation: pulse 4s ease-in-out infinite;
  }

  .intro h2 { 
    font-size: 4rem;
    font-weight: 900;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
    position: relative;
  }

  .intro h2::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: var(--accent-gradient);
    border-radius: 2px;
    animation: expandLine 2s ease-out 0.5s both;
  }

  .intro p { 
    font-size: 1.5rem;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto 3rem;
    line-height: 1.6;
    font-weight: 400;
  }

  .btn-group { 
    margin-top: 3rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .btn { 
    background: var(--primary-gradient);
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: var(--shadow-light);
    transition: box-shadow 0.3s ease;
    user-select: none;
    text-align: center;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    border: none;
    cursor: pointer;
    text-decoration: none;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    border-radius: 60px;
  }

  .btn::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: var(--green-gradient);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -1;
    border-radius: 65px;
    filter: blur(20px);
    animation: gradientShift 6s ease-in-out infinite;
  }

  .btn::before {
    background: conic-gradient(from 0deg at 50% 50%, 
      transparent 0deg, 
      rgba(255, 255, 255, 0.2) 60deg, 
      transparent 120deg,
      rgba(255, 255, 255, 0.3) 180deg,
      transparent 240deg,
      rgba(255, 255, 255, 0.2) 300deg,
      transparent 360deg
    );
    animation: rotate 15s linear infinite;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn:hover::after {
    opacity: 0.8;
  }

  .btn:hover, .btn:focus { 
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-heavy);
    outline: none;
  }

  .btn:active {
    transform: translateY(-5px) rotateX(5deg) rotateY(2deg) scale(1.05);
  }

  .btn span {
    position: relative;
    z-index: 2;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    transform-style: preserve-3d;
  }

  .btn:hover span {
    transform: translateZ(20px) rotateX(5deg);
  }
  /* Features Section */
  section.features { 
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 3rem;
    margin-bottom: 6rem;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  section.features.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card { 
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid var(--border-color);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: var(--shadow-light);
    transition: box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--primary-gradient);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -1;
    border-radius: 34px;
    filter: blur(2px);
  }

  .feature-card::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: var(--green-gradient);
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -2;
    border-radius: 42px;
    filter: blur(25px);
    animation: gradientShift 8s ease-in-out infinite;
  }

  .feature-card::before {
    background: conic-gradient(from 0deg at 50% 50%, 
      transparent 0deg, 
      rgba(76, 175, 80, 0.3) 60deg, 
      transparent 120deg,
      rgba(102, 187, 106, 0.3) 180deg,
      transparent 240deg,
      rgba(129, 199, 132, 0.3) 300deg,
      transparent 360deg
    );
    animation: rotate 20s linear infinite;
  }

  .feature-card:hover::before {
    opacity: 0.8;
  }

  .feature-card:hover::after {
    opacity: 0.4;
  }

  .feature-card:hover, .feature-card:focus-within { 
    transform: translateY(-5px) scale(1.02);
    box-shadow: var(--shadow-heavy);
    border-color: rgba(76, 175, 80, 0.6);
  }

  .feature-card:active {
    transform: translateY(-15px) rotateX(5deg) rotateY(4deg) rotateZ(0.5deg) scale(1.02);
  }

  .feature-icon { 
    font-size: 2.8rem;
    margin-bottom: 1.5rem;
    display: block;
    filter: drop-shadow(0 0 20px rgba(76, 175, 80, 0.6));
    animation: iconFloat 4s ease-in-out infinite, iconGlow 3s ease-in-out infinite alternate;
    transform-style: preserve-3d;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    color: #4caf50;
    will-change: transform, filter;
    transform-origin: center center;
  }

  .feature-icon::before {
    content: attr(data-icon);
    position: absolute;
    top: 0;
    left: 0;
    background: var(--green-gradient);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateZ(20px) rotateY(180deg) scale(1.2);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    animation: gradientShift 6s ease-in-out infinite;
  }

  .feature-icon::after {
    content: attr(data-icon);
    position: absolute;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.8) 0%, transparent 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateZ(-10px) scale(0.8);
    transition: all 0.8s ease;
    filter: blur(1px);
  }

  .feature-card:hover .feature-icon {
    transform: translateZ(40px) rotateY(720deg) rotateX(15deg) rotateZ(5deg) scale(1.3);
    filter: drop-shadow(0 0 60px rgba(76, 175, 80, 1)) drop-shadow(0 0 120px rgba(102, 187, 106, 0.9)) drop-shadow(0 0 180px rgba(129, 199, 132, 0.6));
  }

  .feature-card:hover .feature-icon::before {
    opacity: 1;
    transform: translateZ(0) rotateY(0deg) scale(1);
  }

  .feature-card:hover .feature-icon::after {
    opacity: 0.6;
    transform: translateZ(-5px) scale(1.1);
  }

  .feature-title { 
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .feature-desc { 
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 400;
  }
  /* Bot Status Section */
  section.bot-status { 
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 3rem;
    max-width: 500px;
    margin: 0 auto 6rem;
    text-align: center;
    box-shadow: var(--shadow-light);
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  section.bot-status::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    animation: rotate 10s linear infinite;
    z-index: -1;
  }

  section.bot-status.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  section.bot-status h3 { 
    color: var(--text-primary);
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  #botIcon {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid transparent;
    background: var(--primary-gradient);
    background-clip: padding-box;
    margin-bottom: 2rem;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-light);
  }

  #botIcon:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: var(--shadow-heavy), var(--glow-primary);
  }

  #botStatus, #botUptime, #botServers, #botUsers { 
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
  }

  #botStatus i, #botUptime i, #botServers i, #botUsers i {
    color: var(--text-primary);
    font-size: 1.3rem;
  }
  /* FAQ Section */
  section.faq { 
    max-width: 900px;
    margin: 0 auto 6rem;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  section.faq.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  section.faq h3 { 
    text-align: center;
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 3rem;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .faq-item { 
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    margin-bottom: 1.5rem;
    overflow: hidden;
    box-shadow: var(--shadow-light);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .faq-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-heavy);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .faq-question { 
    padding: 1.5rem 2rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--text-primary);
    user-select: none;
    position: relative;
    border: none;
    width: 100%;
    text-align: right;
    background: transparent;
    transition: all 0.3s ease;
  }

  .faq-question:hover {
    background: rgba(102, 126, 234, 0.05);
  }

  .faq-question::after { 
    content: '+';
    position: absolute;
    left: 2rem;
    font-size: 2rem;
    font-weight: 300;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-primary);
  }

  .faq-item.open .faq-question::after { 
    content: '−';
    transform: rotate(180deg);
  }

  .faq-answer { 
    max-height: 0;
    overflow: hidden;
    padding: 0 2rem;
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: right;
  }

  .faq-item.open .faq-answer { 
    max-height: 300px;
    padding: 1.5rem 2rem 2rem;
  }
  /* Testimonials Section */
  section.testimonials { 
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 3rem;
    max-width: 900px;
    margin: 0 auto 6rem;
    box-shadow: var(--shadow-light);
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  section.testimonials::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--primary-gradient);
  }

  section.testimonials.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  section.testimonials h3 { 
    text-align: center;
    color: var(--text-primary);
    margin-bottom: 3rem;
    font-size: 2.5rem;
    font-weight: 700;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .testimonial { 
    text-align: center;
    font-style: italic;
    color: var(--text-secondary);
    font-size: 1.3rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    position: relative;
    padding: 2rem;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 16px;
    border-left: 4px solid transparent;
    border-image: var(--primary-gradient) 1;
  }

  .testimonial::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 4rem;
    color: rgba(102, 126, 234, 0.3);
    font-family: serif;
  }

  .testimonial-author { 
    margin-top: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    font-size: 1.1rem;
    font-style: normal;
  }
  /* Developers Section */
  section.developers { 
    max-width: 1200px;
    margin: 0 auto 6rem;
    padding: 0 1rem;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  section.developers.visible { 
    opacity: 1;
    transform: translateY(0);
  }

  section.developers h3 { 
    text-align: center;
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 3rem;
    background: var(--primary-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dev-grid { 
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
  }

  .dev-card { 
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 3rem;
    box-shadow: var(--shadow-light);
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .dev-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--primary-gradient);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .dev-card:hover::before {
    opacity: 0.1;
  }

  .dev-card:hover, .dev-card:focus-within { 
    transform: translateY(-15px) scale(1.02);
    box-shadow: var(--shadow-heavy), var(--glow-primary);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .dev-photo { 
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 2rem;
    border: 4px solid transparent;
    background: var(--primary-gradient);
    background-clip: padding-box;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-light);
  }

  .dev-card:hover .dev-photo {
    transform: scale(1.1) rotate(5deg);
    box-shadow: var(--shadow-heavy), var(--glow-primary);
  }

  .dev-name { 
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .dev-role { 
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .dev-social { 
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .dev-social a { 
    color: var(--text-secondary);
    font-size: 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0.75rem;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid var(--border-color);
  }

  .dev-social a:hover, .dev-social a:focus { 
    color: var(--text-primary);
    background: var(--primary-gradient);
    transform: translateY(-3px) scale(1.1);
    box-shadow: var(--shadow-light), var(--glow-primary);
    outline: none;
  }
  /* Footer */
  footer { 
    background: var(--darker-bg);
    color: var(--text-muted);
    text-align: center;
    padding: 3rem 2rem;
    font-size: 1rem;
    user-select: none;
    position: relative;
    border-top: 1px solid var(--border-color);
  }

  footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--primary-gradient);
  }

  footer a { 
    color: var(--text-secondary);
    margin: 0 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
  }

  footer a::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-gradient);
    transition: width 0.3s ease;
  }

  footer a:hover, footer a:focus { 
    color: var(--text-primary);
    outline: none;
  }

  footer a:hover::after {
    width: 100%;
  }

  /* Expert Level Animations */
  @keyframes logoFloat {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg) scale(1) rotateX(0deg) rotateY(0deg); 
      filter: drop-shadow(0 0 20px rgba(76, 175, 80, 0.5));
    }
    25% { 
      transform: translateY(-20px) rotate(3deg) scale(1.08) rotateX(5deg) rotateY(2deg); 
      filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.7));
    }
    50% { 
      transform: translateY(-25px) rotate(5deg) scale(1.12) rotateX(8deg) rotateY(4deg); 
      filter: drop-shadow(0 0 40px rgba(102, 187, 106, 0.8));
    }
    75% { 
      transform: translateY(-15px) rotate(2deg) scale(1.05) rotateX(3deg) rotateY(1deg); 
      filter: drop-shadow(0 0 25px rgba(76, 175, 80, 0.6));
    }
  }

  @keyframes iconFloat {
    0%, 100% { 
      transform: translateY(0px) scale(1) rotate(0deg) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
      filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.8));
    }
    20% { 
      transform: translateY(-15px) scale(1.15) rotate(8deg) rotateX(10deg) rotateY(5deg) rotateZ(2deg); 
      filter: drop-shadow(0 0 40px rgba(76, 175, 80, 0.9));
    }
    40% { 
      transform: translateY(-20px) scale(1.2) rotate(15deg) rotateX(15deg) rotateY(8deg) rotateZ(3deg); 
      filter: drop-shadow(0 0 50px rgba(102, 187, 106, 1));
    }
    60% { 
      transform: translateY(-18px) scale(1.18) rotate(12deg) rotateX(12deg) rotateY(6deg) rotateZ(2deg); 
      filter: drop-shadow(0 0 45px rgba(129, 199, 132, 0.9));
    }
    80% { 
      transform: translateY(-10px) scale(1.08) rotate(5deg) rotateX(5deg) rotateY(3deg) rotateZ(1deg); 
      filter: drop-shadow(0 0 35px rgba(76, 175, 80, 0.8));
    }
  }

  @keyframes iconGlow {
    0% { 
      filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.8)) 
              drop-shadow(0 0 60px rgba(76, 175, 80, 0.4))
              brightness(1) saturate(1);
    }
    25% { 
      filter: drop-shadow(0 0 40px rgba(102, 187, 106, 0.9)) 
              drop-shadow(0 0 80px rgba(102, 187, 106, 0.5))
              brightness(1.1) saturate(1.2);
    }
    50% { 
      filter: drop-shadow(0 0 50px rgba(129, 199, 132, 1)) 
              drop-shadow(0 0 100px rgba(129, 199, 132, 0.6))
              brightness(1.2) saturate(1.4);
    }
    75% { 
      filter: drop-shadow(0 0 45px rgba(165, 214, 167, 0.9)) 
              drop-shadow(0 0 90px rgba(165, 214, 167, 0.5))
              brightness(1.15) saturate(1.3);
    }
    100% { 
      filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.8)) 
              drop-shadow(0 0 60px rgba(76, 175, 80, 0.4))
              brightness(1) saturate(1);
    }
  }

  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg) scale(0); opacity: 0; }
    10% { opacity: 1; transform: translateY(90vh) rotate(36deg) scale(1); }
    50% { transform: translateY(50vh) rotate(180deg) scale(1.2); }
    90% { opacity: 1; transform: translateY(10vh) rotate(324deg) scale(0.8); }
    100% { transform: translateY(-100px) rotate(360deg) scale(0); opacity: 0; }
  }

  @keyframes backgroundShift {
    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
    25% { transform: translateX(-30px) translateY(-15px) rotate(1deg); }
    50% { transform: translateX(30px) translateY(15px) rotate(-1deg); }
    75% { transform: translateX(-15px) translateY(30px) rotate(0.5deg); }
  }

  @keyframes backgroundPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }

  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.1; }
    25% { transform: translateX(-50%) scale(1.05); opacity: 0.15; }
    50% { transform: translateX(-50%) scale(1.1); opacity: 0.2; }
    75% { transform: translateX(-50%) scale(1.05); opacity: 0.15; }
  }

  @keyframes expandLine {
    0% { width: 0; opacity: 0; }
    50% { width: 50px; opacity: 0.5; }
    100% { width: 100px; opacity: 1; }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes morphing {
    0%, 100% { border-radius: 30px; transform: scale(1); }
    25% { border-radius: 50% 30px 50% 30px; transform: scale(1.05); }
    50% { border-radius: 30px 50% 30px 50%; transform: scale(1.1); }
    75% { border-radius: 50% 50% 30px 30px; transform: scale(1.05); }
  }

  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    10% { transform: translate(-2px, 2px); }
    20% { transform: translate(2px, -2px); }
    30% { transform: translate(-2px, -2px); }
    40% { transform: translate(2px, 2px); }
    50% { transform: translate(-2px, 2px); }
    60% { transform: translate(2px, -2px); }
    70% { transform: translate(-2px, -2px); }
    80% { transform: translate(2px, 2px); }
    90% { transform: translate(-2px, 2px); }
  }

  @keyframes rainbow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes bounce3D {
    0%, 100% { 
      transform: translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1); 
      filter: brightness(1) saturate(1);
    }
    25% { 
      transform: translateY(-25px) rotateX(15deg) rotateY(8deg) rotateZ(2deg) scale(1.05); 
      filter: brightness(1.1) saturate(1.2);
    }
    50% { 
      transform: translateY(-35px) rotateX(0) rotateY(15deg) rotateZ(3deg) scale(1.08); 
      filter: brightness(1.2) saturate(1.4);
    }
    75% { 
      transform: translateY(-20px) rotateX(-8deg) rotateY(8deg) rotateZ(1deg) scale(1.03); 
      filter: brightness(1.15) saturate(1.3);
    }
  }

  @keyframes gradientShift {
    0%, 100% { 
      background-position: 0% 50%; 
      filter: hue-rotate(0deg) saturate(1);
    }
    25% { 
      background-position: 25% 75%; 
      filter: hue-rotate(10deg) saturate(1.2);
    }
    50% { 
      background-position: 100% 50%; 
      filter: hue-rotate(20deg) saturate(1.4);
    }
    75% { 
      background-position: 75% 25%; 
      filter: hue-rotate(15deg) saturate(1.3);
    }
  }

  @keyframes expertPulse {
    0%, 100% { 
      transform: scale(1) rotate(0deg); 
      opacity: 0.8; 
      filter: blur(0px);
    }
    25% { 
      transform: scale(1.1) rotate(90deg); 
      opacity: 0.9; 
      filter: blur(1px);
    }
    50% { 
      transform: scale(1.2) rotate(180deg); 
      opacity: 1; 
      filter: blur(2px);
    }
    75% { 
      transform: scale(1.15) rotate(270deg); 
      opacity: 0.95; 
      filter: blur(1.5px);
    }
  }

  @keyframes morphingExpert {
    0%, 100% { 
      border-radius: 32px; 
      transform: scale(1) rotate(0deg); 
      filter: hue-rotate(0deg);
    }
    20% { 
      border-radius: 50% 32px 50% 32px; 
      transform: scale(1.05) rotate(5deg); 
      filter: hue-rotate(20deg);
    }
    40% { 
      border-radius: 32px 50% 32px 50%; 
      transform: scale(1.1) rotate(10deg); 
      filter: hue-rotate(40deg);
    }
    60% { 
      border-radius: 50% 50% 32px 32px; 
      transform: scale(1.08) rotate(8deg); 
      filter: hue-rotate(30deg);
    }
    80% { 
      border-radius: 32px 32px 50% 50%; 
      transform: scale(1.03) rotate(3deg); 
      filter: hue-rotate(10deg);
    }
  }

  @keyframes physicsBounce {
    0% { 
      transform: translateY(0) scale(1) rotateX(0deg) rotateY(0deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    20% { 
      transform: translateY(-15px) scale(1.08) rotateX(5deg) rotateY(2deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    40% { 
      transform: translateY(-25px) scale(1.15) rotateX(8deg) rotateY(4deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    60% { 
      transform: translateY(-20px) scale(1.12) rotateX(6deg) rotateY(3deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    80% { 
      transform: translateY(-8px) scale(1.04) rotateX(2deg) rotateY(1deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    100% { 
      transform: translateY(0) scale(1) rotateX(0deg) rotateY(0deg); 
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }

  @keyframes ultra4D {
    0%, 100% { 
      transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) translateZ(0px); 
      filter: brightness(1) saturate(1) hue-rotate(0deg);
    }
    25% { 
      transform: translateY(-20px) rotateX(10deg) rotateY(5deg) rotateZ(2deg) scale(1.1) translateZ(10px); 
      filter: brightness(1.1) saturate(1.2) hue-rotate(10deg);
    }
    50% { 
      transform: translateY(-30px) rotateX(15deg) rotateY(10deg) rotateZ(3deg) scale(1.15) translateZ(20px); 
      filter: brightness(1.2) saturate(1.4) hue-rotate(20deg);
    }
    75% { 
      transform: translateY(-25px) rotateX(12deg) rotateY(8deg) rotateZ(2deg) scale(1.12) translateZ(15px); 
      filter: brightness(1.15) saturate(1.3) hue-rotate(15deg);
    }
  }

  @keyframes hyperMorph {
    0%, 100% { 
      border-radius: 40px; 
      transform: scale(1) rotate(0deg) skew(0deg); 
      filter: hue-rotate(0deg) saturate(1);
    }
    20% { 
      border-radius: 60% 40px 60% 40px; 
      transform: scale(1.05) rotate(5deg) skew(2deg); 
      filter: hue-rotate(20deg) saturate(1.2);
    }
    40% { 
      border-radius: 40px 60% 40px 60%; 
      transform: scale(1.1) rotate(10deg) skew(3deg); 
      filter: hue-rotate(40deg) saturate(1.4);
    }
    60% { 
      border-radius: 60% 60% 40px 40px; 
      transform: scale(1.08) rotate(8deg) skew(2deg); 
      filter: hue-rotate(30deg) saturate(1.3);
    }
    80% { 
      border-radius: 40px 40px 60% 60%; 
      transform: scale(1.03) rotate(3deg) skew(1deg); 
      filter: hue-rotate(10deg) saturate(1.1);
    }
  }

  @keyframes cursorPulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1); 
      opacity: 1;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.2); 
      opacity: 0.8;
    }
  }

  @keyframes cursorRotate {
    0% { 
      transform: translate(-50%, -50%) rotate(0deg); 
    }
    100% { 
      transform: translate(-50%, -50%) rotate(360deg); 
    }
  }

  @keyframes logoGlow {
    0% { 
      filter: drop-shadow(0 0 30px rgba(76, 175, 80, 0.8)) brightness(1.1) saturate(1.2);
    }
    100% { 
      filter: drop-shadow(0 0 50px rgba(76, 175, 80, 1)) brightness(1.3) saturate(1.4);
    }
  }

  @keyframes logoAura {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1); 
      opacity: 0.3;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.5); 
      opacity: 0.6;
    }
  }

  @keyframes logoShadow {
    0%, 100% { 
      transform: translateZ(-8px) scale(1.08); 
      opacity: 0;
    }
    50% { 
      transform: translateZ(-4px) scale(1.04); 
      opacity: 0.4;
    }
  }

  /* Loading Animation */
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--dark-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  }

  .loading.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(102, 126, 234, 0.2);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .intro h2 { font-size: 2.5rem; }
    .intro p { font-size: 1.2rem; }
    .btn-group { gap: 1rem; }
    .btn { padding: 0.875rem 2rem; font-size: 1rem; }
    .feature-card { padding: 2rem; }
    .dev-card { padding: 2rem; }
    .faq-question { padding: 1.25rem 1.5rem; font-size: 1.1rem; }
    .faq-answer { padding: 0 1.5rem; }
    .faq-item.open .faq-answer { padding: 1.25rem 1.5rem 1.5rem; }
    main { padding: 6rem 1rem 3rem; }
    header { padding: 1rem; }
    .btn-group { flex-direction: column; align-items: center; }
  }

  @media (max-width: 480px) {
    .intro h2 { font-size: 2rem; }
    .intro p { font-size: 1.1rem; }
    .feature-card { padding: 1.5rem; }
    .dev-card { padding: 1.5rem; }
    .testimonial { font-size: 1.1rem; padding: 1.5rem; }
    section.faq h3, section.developers h3 { font-size: 2rem; }
  }
</style>
</head>
<body>

<!-- Loading Screen -->
<div class="loading" id="loading">
  <div class="spinner"></div>
</div>

<!-- Floating Particles -->
<div class="particles" id="particles"></div>

<header>
  <div class="logo" aria-label="Safety Bot Logo">
    <img src="https://i.ibb.co/Hq8V39j/image.png" alt="" aria-hidden="true" />
    <h1 data-lang-ar="بوت الأمان" data-lang-en="Safety Bot">بوت الأمان</h1>
  </div>
  <button class="lang-toggle" aria-pressed="false" aria-label="Toggle language" id="langToggle">English</button>
</header>

<main>
  <!-- Intro Section -->
  <section class="intro" aria-live="polite" aria-atomic="true">
    <h2 id="welcome" data-lang-ar="مرحبًا بك في بوت الأمان" data-lang-en="Welcome to Safety Bot">مرحبًا بك في بوت الأمان</h2>
    <p id="description" data-lang-ar="حماية متطورة وإدارة فعالة لسيرفر الديسكورد الخاص بك" data-lang-en="Advanced protection and management for your Discord server">حماية متطورة وإدارة فعالة لسيرفر الديسكورد الخاص بك</p>
    <div class="btn-group">
      <a href="/auth/discord" class="btn" role="button" tabindex="0" data-lang-ar="تسجيل الدخول باستخدام ديسكورد" data-lang-en="Login with Discord">
        <span>تسجيل الدخول باستخدام ديسكورد</span>
      </a>
      <a href="https://discord.com/api/oauth2/authorize?client_id=1413605227675910194&permissions=8&scope=bot%20applications.commands" class="btn" role="button" tabindex="0" target="_blank" rel="noopener noreferrer" data-lang-ar="دعوة البوت إلى سيرفرك" data-lang-en="Invite Bot to Server">
        <span>دعوة البوت إلى سيرفرك</span>
      </a>
    </div>
  </section>

  <!-- Features Section -->
  <section class="features" aria-label="Bot features">
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">🛡️</div>
      <h3 data-lang-ar="حماية ضد الرسائل المزعجة والروابط الضارة" data-lang-en="Protection against spam and malicious links">حماية ضد الرسائل المزعجة والروابط الضارة</h3>
      <p data-lang-ar="نظام متطور لمنع الرسائل غير المرغوب فيها والروابط التي قد تضر بسيرفرك." data-lang-en="Advanced system to block spam messages and harmful links.">نظام متطور لمنع الرسائل غير المرغوب فيها والروابط التي قد تضر بسيرفرك.</p>
    </article>
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">⚠️</div>
      <h3 data-lang-ar="نظام تحذير وحظر متقدم" data-lang-en="Advanced warning and ban system">نظام تحذير وحظر متقدم</h3>
      <p data-lang-ar="إدارة سهلة للتحذيرات والحظر لضمان بيئة آمنة لجميع الأعضاء." data-lang-en="Easy management of warnings and bans to ensure a safe environment.">إدارة سهلة للتحذيرات والحظر لضمان بيئة آمنة لجميع الأعضاء.</p>
    </article>
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">🖥️</div>
      <h3 data-lang-ar="لوحة تحكم سهلة الاستخدام" data-lang-en="Easy-to-use control panel">لوحة تحكم سهلة الاستخدام</h3>
      <p data-lang-ar="واجهة مستخدم بسيطة تتيح لك التحكم الكامل في إعدادات البوت." data-lang-en="Simple interface allowing full control over bot settings.">واجهة مستخدم بسيطة تتيح لك التحكم الكامل في إعدادات البوت.</p>
    </article>
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">⚙️</div>
      <h3 data-lang-ar="تخصيص كامل لإعدادات الأمان" data-lang-en="Full customization of security settings">تخصيص كامل لإعدادات الأمان</h3>
      <p data-lang-ar="يمكنك ضبط كل خاصية لتناسب احتياجات سيرفرك بدقة." data-lang-en="You can adjust every feature to fit your server's needs precisely.">يمكنك ضبط كل خاصية لتناسب احتياجات سيرفرك بدقة.</p>
    </article>
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">🚫</div>
      <h3 data-lang-ar="حماية ضد عمليات الاحتيال" data-lang-en="Protection against scams">حماية ضد عمليات الاحتيال</h3>
      <p data-lang-ar="كشف ومنع محاولات الاحتيال لضمان سلامة الأعضاء." data-lang-en="Detecting and preventing scam attempts to ensure members’ safety.">كشف ومنع محاولات الاحتيال لضمان سلامة الأعضاء.</p>
    </article>
    <article class="feature-card" tabindex="0">
      <div class="feature-icon" aria-hidden="true">🛡️</div>
      <h3 data-lang-ar="حماية ضد هجمات الاختراق الجماعي" data-lang-en="Protection against mass hacking attacks">حماية ضد هجمات الاختراق الجماعي</h3>
      <p data-lang-ar="آليات متقدمة لمنع الهجمات الجماعية وحماية سيرفرك." data-lang-en="Advanced mechanisms to prevent mass attacks and protect your server.">آليات متقدمة لمنع الهجمات الجماعية وحماية سيرفرك.</p>
    </article>
  </section>

  <!-- Bot Status Section -->
  <section class="bot-status" aria-label="Bot status">
    <h3 data-lang-ar="حالة البوت" data-lang-en="Bot Status">حالة البوت</h3>
    <img id="botIcon" src="https://i.ibb.co/Hq8V39j/image.png" alt="بوت الأمان" style="width:120px; height:120px; border-radius:50%; border:4px solid #4caf50; margin-bottom:1rem; transition:transform 0.5s ease;">
    <div id="botStatus">...</div>
    <div id="botUptime">...</div>
    <div id="botServers">...</div>
    <div id="botUsers">...</div>
  </section>
  <!-- FAQ Section -->
  <section class="faq" aria-label="Frequently Asked Questions">
    <h3 data-lang-ar="الأسئلة الشائعة" data-lang-en="Frequently Asked Questions">الأسئلة الشائعة</h3>
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false" aria-controls="faq1" id="faq1-btn" data-lang-ar="كيف يمكنني دعوة البوت إلى سيرفري؟" data-lang-en="How can I invite the bot to my server?">كيف يمكنني دعوة البوت إلى سيرفري؟</button>
      <div class="faq-answer" id="faq1" role="region" aria-labelledby="faq1-btn" hidden data-lang-ar="يمكنك استخدام رابط الدعوة الموجود في الصفحة أو من خلال لوحة التحكم الخاصة بالبوت." data-lang-en="You can use the invite link on the page or through the bot control panel.">يمكنك استخدام رابط الدعوة الموجود في الصفحة أو من خلال لوحة التحكم الخاصة بالبوت.</div>
    </div>
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false" aria-controls="faq2" id="faq2-btn" data-lang-ar="هل البوت مجاني للاستخدام؟" data-lang-en="Is the bot free to use?">هل البوت مجاني للاستخدام؟</button>
      <div class="faq-answer" id="faq2" role="region" aria-labelledby="faq2-btn" hidden data-lang-ar="نعم، البوت مجاني مع بعض الميزات المدفوعة القادمة في المستقبل." data-lang-en="Yes, the bot is free with some premium features coming in the future.">نعم، البوت مجاني مع بعض الميزات المدفوعة القادمة في المستقبل.</div>
    </div>
    <div class="faq-item">
      <button class="faq-question" aria-expanded="false" aria-controls="faq3" id="faq3-btn" data-lang-ar="كيف يمكنني التواصل مع الدعم؟" data-lang-en="How can I contact support?">كيف يمكنني التواصل مع الدعم؟</button>
      <div class="faq-answer" id="faq3" role="region" aria-labelledby="faq3-btn" hidden data-lang-ar="يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال سيرفر الديسكورد الخاص بنا." data-lang-en="You can contact us via email or through our Discord server.">يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال سيرفر الديسكورد الخاص بنا.</div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="testimonials" aria-label="User testimonials">
    <h3 data-lang-ar="ماذا يقول المستخدمون" data-lang-en="What users say">ماذا يقول المستخدمون</h3>
    <blockquote class="testimonial" tabindex="0" data-lang-ar="بوت الأمان ساعدني كثيرًا في حماية سيرفري من الرسائل المزعجة والهجمات." data-lang-en="Safety Bot helped me a lot in protecting my server from spam and attacks.">بوت الأمان ساعدني كثيرًا في حماية سيرفري من الرسائل المزعجة والهجمات.
      <footer class="testimonial-author">- أحمد</footer>
    </blockquote>
    <blockquote class="testimonial" tabindex="0" data-lang-ar="لوحة التحكم سهلة الاستخدام والميزات متقدمة جدًا." data-lang-en="The control panel is easy to use and the features are very advanced.">لوحة التحكم سهلة الاستخدام والميزات متقدمة جدًا.
      <footer class="testimonial-author">- سارة</footer>
    </blockquote>
    <blockquote class="testimonial" tabindex="0" data-lang-ar="أنصح الجميع باستخدام بوت الأمان للحفاظ على سيرفر ديسكورد آمن." data-lang-en="I recommend everyone to use Safety Bot to keep their Discord server safe.">أنصح الجميع باستخدام بوت الأمان للحفاظ على سيرفر ديسكورد آمن.
      <footer class="testimonial-author">- محمد</footer>
    </blockquote>
  </section>

  <!-- Developers Section -->
  <section class="developers" aria-label="Developers">
    <h3 data-lang-ar="المطورون" data-lang-en="Developers">المطورون</h3>
    <div class="dev-grid">
      <article class="dev-card" tabindex="0">
        <img src="https://i.postimg.cc/9fH9dN1w/download.jpg" alt="صورة المطور أحمد" class="dev-photo" />
        <h4 class="dev-name">Apoca</h4>
        <p class="dev-role" data-lang-ar="المطور الرئيسي" data-lang-en="Lead Developer">المطور الرئيسي</p>
        <div class="dev-social" aria-label="روابط ابوكا علي الاجتماعية">
          <a href="https://discord.gg/bUhr3CYGn3" target="_blank" rel="noopener noreferrer" class="btn-social discord" aria-label="Discord">
            <i class="fa-brands fa-discord"></i> Discord
          </a>
          <a href="https://github.com/apocadev" target="_blank" rel="noopener noreferrer" class="btn-social github" aria-label="GitHub">
            <i class="fa-brands fa-github"></i> GitHub
          </a>
        </div>
      </article>
    </div>
  </section>

</main>

<!-- Footer -->
<footer>
  &copy; 2025 بوت الأمان. كل الحقوق محفوظة.
  <a href="#" data-lang-ar="سياسة الخصوصية" data-lang-en="Privacy Policy">سياسة الخصوصية</a> |
  <a href="#" data-lang-ar="الشروط والأحكام" data-lang-en="Terms & Conditions">الشروط والأحكام</a>
</footer>

<script>
  // Loading Screen
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
    }, 1500);
  });

  // MINIMAL PARTICLE SYSTEM - NO LAG
  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15; // Drastically reduced for zero lag
    
    // Single color for performance
    const color = 'rgba(76, 175, 80, 0.4)';

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Minimal size and styling
      particle.style.cssText = `
        width: 3px;
        height: 3px;
        left: ${Math.random() * 100}%;
        background: ${color};
        border-radius: 50%;
        position: absolute;
        animation: float 20s linear infinite;
        animation-delay: ${Math.random() * 20}s;
      `;
      
      particlesContainer.appendChild(particle);
    }
  }

  // DISABLED MORPHING SHAPES - NO LAG
  function createMorphingShapes() {
    // Morphing shapes completely disabled to eliminate lag
    // Only keep minimal background effects
  }

  // Header Scroll Effect
  let lastScrollY = window.scrollY;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  });

  // FAQ Accordion with Enhanced Animations
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      const answer = item.querySelector('.faq-answer');
      
      if(open) {
        answer.removeAttribute('hidden');
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(102, 126, 234, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        item.style.position = 'relative';
        item.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      } else {
        answer.setAttribute('hidden','');
      }
    });
  });

  // Enhanced Scroll Animations with Stagger
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if(entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.intro, .features, .faq, .testimonials, .developers, .bot-status').forEach(el => {
    observer.observe(el);
  });

  // Stagger animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Language Toggle with Smooth Transition
  const langBtn = document.getElementById('langToggle');
  let arabic = true;
  
  langBtn.addEventListener('click', () => {
    arabic = !arabic;
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    
    document.querySelectorAll('[data-lang-ar]').forEach(el => {
      el.style.opacity = '0';
      setTimeout(() => {
      el.textContent = arabic ? el.getAttribute('data-lang-ar') : el.getAttribute('data-lang-en');
        el.style.opacity = '1';
      }, 150);
    });
    
    langBtn.textContent = arabic ? 'English' : 'العربية';
    document.documentElement.dir = arabic ? 'rtl' : 'ltr';
    document.documentElement.lang = arabic ? 'ar' : 'en';
  });

  // Enhanced Bot Status Update with Animations
  async function updateBotStatus() {
    const statusEl = document.getElementById('botStatus');
    const uptimeEl = document.getElementById('botUptime');
    const serversEl = document.getElementById('botServers');
    const usersEl = document.getElementById('botUsers');
    const iconEl = document.getElementById('botIcon');
    const botSection = document.querySelector('.bot-status');

    try {
      const res = await fetch('/api/bot-status');
      const data = await res.json();

      // Animate status update
      statusEl.style.transform = 'scale(0.95)';
      uptimeEl.style.transform = 'scale(0.95)';
      serversEl.style.transform = 'scale(0.95)';
      usersEl.style.transform = 'scale(0.95)';

      setTimeout(() => {
      statusEl.innerHTML = `<i class="fas ${data.online ? 'fa-circle' : 'fa-circle offline'}"></i>
                            <span>الحالة: ${data.online ? 'متصل ✅' : 'غير متصل ❌'}</span>`;
      uptimeEl.innerHTML = `<i class="fas fa-clock"></i> <span>مدة التشغيل: ${data.uptime}</span>`;
      serversEl.innerHTML = `<i class="fas fa-server"></i> <span>عدد السيرفرات: ${data.servers}</span>`;
      usersEl.innerHTML = `<i class="fas fa-users"></i> <span>عدد المستخدمين: ${data.users || 'جارٍ الحساب...'}</span>`;

        statusEl.style.transform = 'scale(1)';
        uptimeEl.style.transform = 'scale(1)';
        serversEl.style.transform = 'scale(1)';
        usersEl.style.transform = 'scale(1)';
      }, 150);

      if(data.icon) {
        iconEl.style.transform = 'scale(1.1) rotate(10deg)';
        setTimeout(() => {
          iconEl.src = data.icon;
          iconEl.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
      }

      botSection.style.border = `4px solid ${data.online ? '#4caf50' : '#f44336'}`;

    } catch {
      statusEl.innerHTML = `<i class="fas fa-exclamation-triangle offline"></i><span>خطأ في جلب الحالة</span>`;
      uptimeEl.innerHTML = '';
      serversEl.innerHTML = '';
      usersEl.innerHTML = '';
      botSection.style.border = '4px solid #f44336';
    }
  }

  // ULTRA-OPTIMIZED PARALLAX SYSTEM - ZERO LAG
  let scrollY = 0;
  let isScrolling = false;
  let scrollRAF = null;
  let lastScrollTime = 0;
  const scrollThrottle = 16; // 60 FPS

  // ULTRA-OPTIMIZED SCROLL HANDLER - ZERO LAG
  let scrollTimeout;
  let wheelTimeout;
  let isWheelScrolling = false;
  const scrollCooldown = 8; // 120 FPS max

  function handleScroll() {
    const now = performance.now();
    if (now - lastScrollTime < scrollThrottle) {
      return; // Skip if too soon
    }
    lastScrollTime = now;

    if (!isScrolling) {
      isScrolling = true;
      if (scrollRAF) {
        cancelAnimationFrame(scrollRAF);
      }
      scrollRAF = requestAnimationFrame(() => {
        scrollY = window.pageYOffset;
        updateParallax();
        isScrolling = false;
        scrollRAF = null;
      });
    }
    
    // Debounce scroll events
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Additional scroll cleanup if needed
    }, 50); // Reduced debounce time
  }

  // ULTRA-OPTIMIZED WHEEL HANDLER - ZERO LAG
  function handleWheel(e) {
    e.preventDefault(); // Prevent default scroll behavior
    
    const now = performance.now();
    if (now - lastScrollTime < scrollThrottle) {
      return; // Skip if too soon
    }
    lastScrollTime = now;

    if (!isWheelScrolling) {
      isWheelScrolling = true;
      
      // Ultra smooth wheel scroll with reduced sensitivity
      const delta = e.deltaY;
      const scrollAmount = delta * 0.3; // ULTRA reduced scroll sensitivity
      
      // Use requestAnimationFrame for smooth scroll
      requestAnimationFrame(() => {
        window.scrollBy({
          top: scrollAmount,
          behavior: 'auto' // Use instant scroll for better performance
        });
        
        // Update scroll position immediately
        scrollY = window.pageYOffset;
        updateParallax();
      });
      
      // Reset wheel scrolling flag
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isWheelScrolling = false;
      }, 8); // 120 FPS
    }
  }

  // Mouse tracking with ultra optimization
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let mouseRAF = null;
  let lastMouseTime = 0;
  const mouseThrottle = 16; // 60 FPS

  function handleMouseMove(e) {
    const now = performance.now();
    if (now - lastMouseTime >= mouseThrottle) {
      if (mouseRAF) {
        cancelAnimationFrame(mouseRAF);
      }
      mouseRAF = requestAnimationFrame(() => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        targetX = (mouseX - 0.5) * 0.5; // Reduced intensity
        targetY = (mouseY - 0.5) * 0.5; // Reduced intensity
        lastMouseTime = now;
        mouseRAF = null;
      });
    }
  }


  // Performance monitoring system
  let frameCount = 0;
  let lastFPSUpdate = 0;
  let currentFPS = 60;

  function updateFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastFPSUpdate >= 1000) {
      currentFPS = frameCount;
      frameCount = 0;
      lastFPSUpdate = now;
      
      // Auto-adjust performance if FPS drops
      if (currentFPS < 50) {
        // Reduce parallax intensity if performance drops
        // Performance optimization applied automatically
      }
    }
  }

  // Cache system for performance
  let cardsCache = null;
  let buttonsCache = null;
  let lastUpdateTime = 0;
  const updateInterval = 16; // 60 FPS

  // ULTRA-OPTIMIZED PARALLAX UPDATE - ZERO LAG
  function updateParallax() {
    const now = performance.now();
    if (now - lastUpdateTime < updateInterval) {
      return; // Skip if too soon
    }
    lastUpdateTime = now;
    
    updateFPS();
    
    // Ultra smooth mouse interpolation with reduced intensity
    currentX += (targetX - currentX) * 0.05; // Reduced from 0.1
    currentY += (targetY - currentY) * 0.05; // Reduced from 0.1

    // Cache elements to avoid repeated DOM queries
    if (!cardsCache) {
      cardsCache = document.querySelectorAll('.feature-card');
    }
    if (!buttonsCache) {
      buttonsCache = document.querySelectorAll('.btn');
    }

    // ULTRA-OPTIMIZED PARALLAX FOR CARDS
    const cardCount = cardsCache.length;
    
    for (let i = 0; i < cardCount; i++) {
      const card = cardsCache[i];
      const speed = (i + 1) * 0.001; // ULTRA reduced speed
      const depth = (i + 1) * 0.005; // ULTRA reduced depth
      
      const x = currentX * speed * 8; // ULTRA reduced movement
      const y = currentY * speed * 8; // ULTRA reduced movement
      const rotateX = currentY * 1 * depth; // ULTRA reduced rotation
      const rotateY = currentX * 1 * depth; // ULTRA reduced rotation
      
      // Use transform3d for GPU acceleration
      card.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // ULTRA-OPTIMIZED PARALLAX FOR BUTTONS
    const buttonCount = buttonsCache.length;
    
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttonsCache[i];
      const speed = (i + 1) * 0.001; // ULTRA reduced speed
      
      const x = currentX * speed * 5; // ULTRA reduced movement
      const y = currentY * speed * 5; // ULTRA reduced movement
      
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }

  // ULTRA-OPTIMIZED EVENT LISTENERS - ZERO LAG
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  
  // Wheel event with passive: false to allow preventDefault
  document.addEventListener('wheel', handleWheel, { passive: false });
  
  // Touch events for mobile optimization
  document.addEventListener('touchstart', handleScroll, { passive: true });
  document.addEventListener('touchmove', handleScroll, { passive: true });

  // Glitch Effect on Hover
  document.querySelectorAll('.feature-card, .btn').forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.animation = 'glitch 0.3s ease-in-out';
      setTimeout(() => {
        element.style.animation = '';
      }, 300);
    });
  });

  // Green Text Effect
  function addGreenEffect() {
    const titles = document.querySelectorAll('h1, h2, h3');
    titles.forEach(title => {
      title.style.background = 'var(--green-gradient)';
      title.style.backgroundSize = '200% 200%';
      title.style.webkitBackgroundClip = 'text';
      title.style.webkitTextFillColor = 'transparent';
      title.style.animation = 'greenPulse 4s ease-in-out infinite';
    });
  }

  // Shimmer Effect
  function addShimmerEffect() {
    const cards = document.querySelectorAll('.feature-card, .dev-card');
    cards.forEach(card => {
      const shimmer = document.createElement('div');
      shimmer.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: shimmer 3s ease-in-out infinite;
        pointer-events: none;
      `;
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(shimmer);
    });
  }

  // Initialize everything with green effects
  // SIMPLIFIED CURSOR SYSTEM - NO LAG
  function initCustomCursor() {
    // Disable custom cursor to eliminate lag
    // Use default browser cursor for maximum performance
    document.body.style.cursor = 'default';
  }

  // Attractive Loading System
  function initLoadingSystem() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading Amazing Experience...</div>
    `;
    document.body.appendChild(loadingOverlay);

    // Hide loading after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
          loadingOverlay.remove();
        }, 500);
      }, 1000);
    });
  }

  // Attractive Scroll Indicator
  function initScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(scrollIndicator);

    const scrollProgress = scrollIndicator.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // DISABLED FLOATING ELEMENTS - NO LAG
  function createFloatingElements() {
    // Floating elements completely disabled to eliminate lag
  }

  // Beautiful Scroll Reveal System
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
      observer.observe(reveal);
    });
  }

  // SIMPLIFIED HOVER EFFECTS - NO LAG
  function initHoverEffects() {
    // Only add essential hover effects to prevent lag
    document.querySelectorAll('.feature-card').forEach(card => {
      card.classList.add('hover-scale');
    });

    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('hover-scale');
    });
  }

  // Beautiful Loading Animation
  function initBeautifulLoading() {
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      loadingText.classList.add('loading-dots');
    }
  }

  // Initialize everything
  initLoadingSystem();
  initScrollIndicator();
  createFloatingElements();
  initCustomCursor();
  createParticles();
  createMorphingShapes();
  addGreenEffect();
  addShimmerEffect();
  initScrollReveal();
  initHoverEffects();
  initBeautifulLoading();
  setInterval(updateBotStatus, 2000);
  window.addEventListener('load', updateBotStatus);

  // Add Ultra Advanced 4D CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      0% { transform: scale(0) rotate(0deg); opacity: 1; }
      25% { transform: scale(1.5) rotate(90deg); opacity: 0.8; }
      50% { transform: scale(3) rotate(180deg); opacity: 0.5; }
      75% { transform: scale(4.5) rotate(270deg); opacity: 0.2; }
      100% { transform: scale(6) rotate(360deg); opacity: 0; }
    }
    
    @keyframes greenPulse {
      0%, 100% { 
        background-position: 0% 50%; 
        filter: hue-rotate(0deg) saturate(1) brightness(1);
      }
      25% { 
        background-position: 25% 75%; 
        filter: hue-rotate(15deg) saturate(1.3) brightness(1.1);
      }
      50% { 
        background-position: 100% 50%; 
        filter: hue-rotate(30deg) saturate(1.6) brightness(1.2);
      }
      75% { 
        background-position: 75% 25%; 
        filter: hue-rotate(20deg) saturate(1.4) brightness(1.15);
      }
    }
    
    .feature-card:hover {
      animation: ultra4D 0.8s var(--timing-4d);
    }
    
    .btn:hover {
      animation: physicsBounce 0.6s var(--timing-4d);
    }
    
    .morphing-shapes div {
      animation-delay: ${Math.random() * 12}s;
    }
    
    /* Ultra 4D Text Effects */
    h1, h2, h3 {
      text-shadow: 
        0 0 20px rgba(76, 175, 80, 0.8),
        0 0 40px rgba(76, 175, 80, 0.6),
        0 0 60px rgba(76, 175, 80, 0.4),
        0 0 80px rgba(102, 187, 106, 0.3),
        0 0 100px rgba(129, 199, 132, 0.2);
      transform-style: preserve-3d;
      will-change: transform, text-shadow;
      animation: greenPulse 6s ease-in-out infinite;
    }
    
    /* Ultra 4D glowing borders */
    .feature-card, .dev-card, .btn {
      position: relative;
    }
    
    .feature-card::before,
    .dev-card::before,
    .btn::before {
      content: '';
      position: absolute;
      inset: -4px;
      padding: 4px;
      background: var(--green-gradient);
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      opacity: 0;
      transition: all 0.8s var(--timing-4d);
      filter: blur(2px);
      animation: gradientShift 8s ease-in-out infinite;
    }
    
    .feature-card:hover::before,
    .dev-card:hover::before,
    .btn:hover::before {
      opacity: 1;
      filter: blur(0px);
    }
    
    /* Ultra 4D scroll effects */
    .feature-card, .dev-card {
      transition: all 1.2s var(--timing-4d);
    }
    
    /* Ultra 4D loading states */
    .loading .spinner {
      animation: spin 1s linear infinite, ultra4D 3s ease-in-out infinite;
    }
    
    /* Ultra 4D focus states */
    .feature-card:focus-within,
    .btn:focus {
      outline: 4px solid rgba(76, 175, 80, 0.7);
      outline-offset: 6px;
      box-shadow: var(--glow-4d);
    }
    
    /* Ultra 4D performance optimizations */
    .feature-card, .btn, .feature-icon {
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transform-style: preserve-3d;
    }
    
    /* Ultra 4D scroll performance */
    * {
      scroll-behavior: smooth;
    }
    
    /* Ultra 4D smooth scrolling */
    html {
      scroll-behavior: smooth;
      overflow-x: hidden;
    }
    
  /* Ultra 4D body optimizations */
  body {
    overflow-x: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }

  /* Enhanced Visual Effects */
  .hero-section {
    position: relative;
    overflow: hidden;
  }

  .hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(102, 187, 106, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(129, 199, 132, 0.08) 0%, transparent 50%);
    animation: backgroundShift 15s ease-in-out infinite;
    z-index: -1;
  }

  .hero-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      conic-gradient(from 0deg at 30% 30%, 
        transparent 0deg, 
        rgba(76, 175, 80, 0.05) 60deg, 
        transparent 120deg,
        rgba(102, 187, 106, 0.05) 180deg,
        transparent 240deg,
        rgba(129, 199, 132, 0.05) 300deg,
        transparent 360deg
      );
    animation: rotate 25s linear infinite;
    z-index: -1;
  }

  /* Enhanced Cards with 4D Effects */
  .feature-card {
    position: relative;
    overflow: hidden;
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      conic-gradient(from 0deg, 
        transparent 0deg, 
        rgba(76, 175, 80, 0.1) 60deg, 
        transparent 120deg,
        rgba(102, 187, 106, 0.1) 180deg,
        transparent 240deg,
        rgba(129, 199, 132, 0.1) 300deg,
        transparent 360deg
      );
    animation: rotate 20s linear infinite;
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: -1;
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  /* Enhanced Buttons */
  .btn {
    position: relative;
    overflow: hidden;
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.8s ease;
    z-index: 1;
  }

  .btn:hover::before {
    left: 100%;
  }

  /* Enhanced Text Effects */
  h1, h2, h3, h4, h5, h6 {
    position: relative;
    overflow: hidden;
  }

  h1::before, h2::before, h3::before {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(102, 187, 106, 0.3));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateY(100%);
    transition: all 0.6s ease;
  }

  h1:hover::before, h2:hover::before, h3:hover::before {
    opacity: 1;
    transform: translateY(0);
  }

  /* Attractive Loading Animation */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  .loading-overlay.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .loading-spinner {
    width: 80px;
    height: 80px;
    border: 4px solid rgba(76, 175, 80, 0.2);
    border-top: 4px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
  }

  .loading-text {
    position: absolute;
    color: #4caf50;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 120px;
    animation: fadeInOut 2s ease-in-out infinite;
  }

  /* Attractive Scroll Indicator */
  .scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(76, 175, 80, 0.2);
    z-index: 1000;
  }

  .scroll-progress {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #66bb6a, #81c784);
    width: 0%;
    transition: width 0.1s ease;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  /* Attractive Floating Elements */
  .floating-elements {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }

  .floating-element {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.6) 0%, transparent 70%);
    border-radius: 50%;
    animation: floatUp 8s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes floatUp {
    0% {
      transform: translateY(100vh) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100px) rotate(360deg);
      opacity: 0;
    }
  }

  /* SIMPLIFIED EFFECTS - NO LAG */
  .hover-scale {
    transition: transform 0.2s ease;
  }

  .hover-scale:hover {
    transform: scale(1.02);
  }
  `;
  document.head.appendChild(style);
</script>
</body>
</html>
