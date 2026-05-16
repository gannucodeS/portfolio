import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600;700&display=swap');
`;

const style = `
  ${FONTS}

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #000000;
    --white: #FFFFFF;
    --red: #C41E3A;
    --red-dim: #8B0000;
    --red-glow: rgba(196,30,58,0.35);
    --grey-dark: #111111;
    --grey-mid: #1A1A1A;
    --grey-subtle: #222222;
    --grey-text: #888888;
    --grey-light: #CCCCCC;
    --font-display: 'Bebas Neue', sans-serif;
    --font-serif: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
    --font-accent: 'Poppins', sans-serif;
  }

  html { scroll-behavior: smooth; font-size: 16px; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    cursor: none;
    overflow-x: hidden;
  }

  ::selection { background: var(--red); color: var(--white); }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--red); }

  /* CURSOR */
  .cursor-dot {
    position: fixed;
    width: 8px; height: 8px;
    background: var(--red);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease, background 0.2s ease;
    mix-blend-mode: normal;
  }
  .cursor-ring {
    position: fixed;
    width: 40px; height: 40px;
    border: 1px solid rgba(196,30,58,0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
  }
  .cursor-glow {
    position: fixed;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(196,30,58,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%, -50%);
    transition: transform 0.4s ease;
  }
  body.hovering .cursor-dot { width: 12px; height: 12px; background: var(--white); }
  body.hovering .cursor-ring { width: 60px; height: 60px; border-color: rgba(255,255,255,0.5); }

  /* NAVBAR */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 60px;
    transition: background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease;
  }
  .navbar.scrolled {
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(20px);
    padding: 16px 60px;
    border-bottom: 1px solid rgba(196,30,58,0.2);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 1.8rem;
    letter-spacing: 0.1em;
    color: var(--white);
    text-decoration: none;
  }
  .nav-logo span { color: var(--red); }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    font-family: var(--font-accent);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--grey-light);
    text-decoration: none;
    position: relative;
    transition: color 0.3s ease;
  }
  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: var(--red);
    transition: width 0.3s ease;
  }
  .nav-links a:hover, .nav-links a.active { color: var(--white); }
  .nav-links a:hover::after, .nav-links a.active::after { width: 100%; }
  .nav-menu-btn {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: none;
    padding: 4px;
  }
  .nav-menu-btn span {
    display: block;
    width: 24px; height: 1px;
    background: var(--white);
    transition: all 0.3s ease;
  }
  .nav-resume {
    font-family: var(--font-accent);
    font-size: 1rem;
    font-weight: 600;
    color: var(--white);
    background: var(--red);
    border: 1px solid var(--red);
    padding: 8px 14px;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: none;
  }
  .nav-resume:hover {
    background: transparent;
    color: var(--white);
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 0 60px;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse 60% 80% at 70% 50%, rgba(139,0,0,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(196,30,58,0.06) 0%, transparent 50%),
      var(--black);
  }
  .hero-grid-lines {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 80px 80px;
  }
  .hero-content {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 60px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding-top: 80px;
  }
  .hero-left {}
  .hero-tag {
    font-family: var(--font-accent);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.3s forwards;
  }
  .hero-tag::before {
    content: '';
    display: inline-block;
    width: 30px; height: 1px;
    background: var(--red);
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(4rem, 9vw, 10rem);
    line-height: 0.9;
    letter-spacing: 0.02em;
    color: var(--white);
    text-transform: uppercase;
    opacity: 0;
    animation: slideInLeft 0.8s ease 0.5s forwards;
  }
  .hero-title .line-red { color: var(--red); display: block; }
  .hero-subtitle {
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 300;
    color: var(--grey-text);
    line-height: 1.7;
    margin-top: 28px;
    max-width: 420px;
    opacity: 0;
    animation: slideInLeft 0.8s ease 0.7s forwards;
  }
  .hero-ctas {
    display: flex;
    gap: 20px;
    margin-top: 40px;
    opacity: 0;
    animation: slideInLeft 0.8s ease 0.9s forwards;
    flex-wrap: wrap;
  }
  .btn-primary {
    font-family: var(--font-accent);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--white);
    background: var(--red);
    border: 1px solid var(--red);
    padding: 14px 36px;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--white);
    transform: translateX(-101%);
    transition: transform 0.35s ease;
  }
  .btn-primary:hover { color: var(--black); }
  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-outline {
    font-family: var(--font-accent);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--white);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 14px 36px;
    text-decoration: none;
    display: inline-block;
    transition: all 0.3s ease;
  }
  .btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,0.05); }
  .hero-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    opacity: 0;
    animation: fadeIn 1s ease 0.6s forwards;
  }
  .hero-image-frame {
    position: relative;
    width: 420px;
    height: 520px;
  }
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    border: 4px solid rgba(139,0,0,0.6);
    position: relative;
    filter: grayscale(20%);
    transition: filter 0.4s ease;
  }
  .hero-image:hover {
    filter: grayscale(0%);
  }
  .hero-image-frame::before {
    content: '';
    position: absolute;
    top: -8px; right: -8px;
    bottom: 8px; left: 8px;
    border: 4px solid rgba(139,0,0,0.4);
    z-index: -1;
  }
  .hero-image-frame::after {
    content: '';
    position: absolute;
    top: 8px; right: 8px;
    bottom: -8px; left: -8px;
    border: 4px solid rgba(255,255,255,0.1);
    z-index: -1;
  }
  .hero-scroll {
    position: absolute;
    bottom: 40px; left: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    animation: fadeIn 1s ease 1.2s forwards;
  }
  .hero-scroll-line {
    width: 40px; height: 1px;
    background: var(--grey-text);
    position: relative;
    overflow: hidden;
  }
  .hero-scroll-line::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: var(--red);
    animation: slideRight 2s ease infinite;
  }
  .hero-scroll-text {
    font-family: var(--font-accent);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--grey-text);
  }

  /* SECTION COMMONS */
  .section { padding: 120px 60px; position: relative; overflow: hidden; }
  .section-inner { max-width: 1400px; margin: 0 auto; }
  .section-label {
    font-family: var(--font-accent);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--red);
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    max-width: 60px;
    height: 1px;
    background: var(--red);
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 6vw, 6rem);
    line-height: 0.95;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 60px;
    animation: slideInLeft 0.8s ease forwards;
  }
  .reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ABOUT */
  .about { background: var(--grey-dark); }
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: center;
  }
  .about-left {}
  .about-text {
    font-family: var(--font-serif);
    font-size: 1.3rem;
    font-weight: 400;
    line-height: 1.75;
    color: var(--grey-light);
    margin-bottom: 32px;
  }
  .about-text em { color: var(--red); font-style: italic; }
  .about-text-body {
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.8;
    color: var(--grey-text);
    margin-bottom: 40px;
  }
  .about-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 40px;
  }
  .stat-item {}
  .stat-num {
    font-family: var(--font-display);
    font-size: 3rem;
    color: var(--red);
    line-height: 1;
  }
  .stat-label {
    font-family: var(--font-accent);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--grey-text);
    margin-top: 8px;
  }
  .about-right {}
  .expertise-list { list-style: none; }
  .expertise-item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: all 0.3s ease;
  }
  .expertise-item:hover { padding-left: 12px; }
  .expertise-num {
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--red);
    opacity: 0.6;
    min-width: 32px;
    margin-top: 2px;
  }
  .expertise-content {}
  .expertise-name {
    font-family: var(--font-accent);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--white);
    margin-bottom: 4px;
  }
  .expertise-desc {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--grey-text);
    line-height: 1.6;
  }

  /* PROJECTS */
  .projects { background: var(--black); }
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    background: rgba(255,255,255,0.05);
  }
  .project-card {
    background: var(--black);
    padding: 48px;
    position: relative;
    overflow: hidden;
    transition: background 0.4s ease;
    cursor: none;
  }
  .project-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(196,30,58,0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .project-card:hover { background: var(--grey-dark); }
  .project-card:hover::before { opacity: 1; }
  .project-num {
    font-family: var(--font-display);
    font-size: 5rem;
    color: rgba(255,255,255,0.04);
    line-height: 1;
    position: absolute;
    top: 24px; right: 36px;
    transition: color 0.4s ease;
  }
  .project-card:hover .project-num { color: rgba(196,30,58,0.1); }
  .project-tag {
    font-family: var(--font-accent);
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 20px;
  }
  .project-title {
    font-family: var(--font-display);
    font-size: 2rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 16px;
    line-height: 1.1;
    transition: color 0.3s ease;
  }
  .project-card:hover .project-title { color: var(--white); }
  .project-desc {
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--grey-text);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }
  .tech-tag {
    font-family: var(--font-accent);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--grey-text);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 5px 12px;
    transition: all 0.3s ease;
  }
  .project-card:hover .tech-tag { border-color: rgba(196,30,58,0.3); color: var(--grey-light); }
  .project-link {
    font-family: var(--font-accent);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--red);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: gap 0.3s ease;
    cursor: pointer;
  }
  .project-link:hover { gap: 16px; }
  .project-link-arrow { font-size: 1rem; }

  /* SKILLS */
  .skills { background: var(--grey-dark); }
  .skills-intro {
    max-width: 600px;
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--grey-text);
    line-height: 1.8;
    margin-bottom: 60px;
  }
  .skills-categories { display: flex; flex-direction: column; gap: 48px; }
  .skill-category {}
  .skill-category-title {
    font-family: var(--font-accent);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--grey-text);
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .skill-tag {
    font-family: var(--font-accent);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--white);
    border: 1px solid rgba(255,255,255,0.12);
    padding: 10px 22px;
    position: relative;
    overflow: hidden;
    transition: all 0.35s ease;
    cursor: none;
  }
  .skill-tag::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--red);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
    z-index: 0;
  }
  .skill-tag span { position: relative; z-index: 1; }
  .skill-tag:hover { border-color: var(--red); color: var(--white); }
  .skill-tag:hover::before { transform: scaleX(1); }
  .skill-featured {
    font-family: var(--font-display);
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    padding: 14px 28px;
    border-color: rgba(196,30,58,0.4);
    color: var(--grey-light);
  }

  /* JOURNEY / TIMELINE */
  .journey { background: var(--black); }
  .timeline { position: relative; padding-left: 40px; }
  .timeline::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--red), rgba(196,30,58,0.1));
  }
  .timeline-item {
    position: relative;
    padding: 0 0 60px 48px;
  }
  .timeline-item:last-child { padding-bottom: 0; }
  .timeline-dot {
    position: absolute;
    left: -4px;
    top: 6px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: var(--red);
    box-shadow: 0 0 16px rgba(196,30,58,0.5);
  }
  .timeline-year {
    font-family: var(--font-display);
    font-size: 0.9rem;
    letter-spacing: 0.15em;
    color: var(--red);
    margin-bottom: 12px;
  }
  .timeline-title {
    font-family: var(--font-display);
    font-size: 1.8rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 6px;
  }
  .timeline-org {
    font-family: var(--font-accent);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--grey-text);
    margin-bottom: 16px;
    letter-spacing: 0.05em;
  }
  .timeline-desc {
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--grey-text);
    line-height: 1.7;
    max-width: 560px;
  }

  /* CONTACT */
  .contact { background: var(--grey-dark); }
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 100px;
    align-items: start;
  }
  .contact-left {}
  .contact-intro {
    font-family: var(--font-serif);
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--grey-light);
    line-height: 1.75;
    margin-bottom: 40px;
  }
  .contact-info { display: flex; flex-direction: column; gap: 20px; }
  .contact-info-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .contact-info-label {
    font-family: var(--font-accent);
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--red);
    min-width: 80px;
    margin-top: 2px;
  }
  .contact-info-value {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--grey-light);
  }
  .contact-right {}
  .contact-form { display: flex; flex-direction: column; gap: 24px; }
  .form-group { position: relative; }
  .form-input, .form-textarea {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding: 14px 0;
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--white);
    outline: none;
    transition: border-color 0.3s ease;
  }
  .form-input::placeholder, .form-textarea::placeholder {
    color: rgba(255,255,255,0.25);
    font-weight: 300;
  }
  .form-input:focus, .form-textarea:focus { border-color: var(--red); }
  .form-textarea { resize: none; height: 120px; }
  .form-line {
    position: absolute;
    bottom: 0; left: 0;
    width: 0; height: 1px;
    background: var(--red);
    transition: width 0.4s ease;
  }
  .form-group:focus-within .form-line { width: 100%; }

  /* FOOTER */
  .footer {
    background: var(--black);
    padding: 40px 60px;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  .footer-logo {
    font-family: var(--font-display);
    font-size: 1.5rem;
    letter-spacing: 0.1em;
    color: var(--white);
  }
  .footer-logo span { color: var(--red); }
  .footer-copy {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: var(--grey-text);
    text-align: center;
  }
  .footer-socials { display: flex; gap: 24px; }
  .social-link {
    font-family: var(--font-accent);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--grey-text);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .social-link:hover { color: var(--red); }

  /* MOBILE */
  @media (max-width: 900px) {
    .navbar { padding: 20px 28px; }
    .navbar.scrolled { padding: 14px 28px; }
    .nav-links { display: none; }
    .nav-menu-btn { display: flex; }
    .hero { padding: 0 28px; }
    .hero-content { grid-template-columns: 1fr; gap: 40px; padding-top: 120px; padding-bottom: 80px; }
    .hero-right { justify-content: center; }
    .hero-image-frame { width: 260px; height: 340px; }
    .hero-title { font-size: clamp(3rem, 12vw, 6rem); }
    .section { padding: 80px 28px; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .projects-grid { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; gap: 48px; }
    .footer { flex-direction: column; text-align: center; padding: 32px 28px; }
    .about-stats { grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .hero-scroll { left: 28px; }
    .nav-resume { display: inline-block; margin-right: 16px; padding: 6px 10px; }
    .btn-primary, .btn-outline { padding: 7px 18px; }
  }
  @media (max-width: 480px) {
    .hero-title { font-size: 3.2rem; }
    .section-title { font-size: 2.8rem; }
    .about-stats { grid-template-columns: repeat(2, 1fr); }
    .hero-ctas { flex-direction: column; }
    .btn-primary, .btn-outline { text-align: center; padding: 7px 18px; }
  }

  /* ANIMATIONS */
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideRight {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 16px rgba(196,30,58,0.5); }
    50% { box-shadow: 0 0 32px rgba(196,30,58,0.9); }
  }
  .timeline-dot { animation: pulse-glow 2s ease infinite; }
`;

const NAV_ITEMS = ["About", "Projects", "Skills", "Journey", "Contact"];

const PROJECTS = [
  {
    num: "01",
    tag: "Full-Stack Application",
    title: "BlueCart",
    subtitle: "E-Commerce Platform",
    desc: "A complete e-commerce platform with JWT-based authentication, role-based access, shopping cart, wishlist, order tracking, and admin product management panel with CRUD operations.",
    tech: ["Express.js", "MongoDB", "JWT", "Node.js", "HTML/CSS/JS"],
    link: "https://bluecart-india.vercel.app/",
  },
  {
    num: "02",
    tag: "Full-Stack Application",
    title: "Shagun",
    subtitle: "Wedding Planning Platform",
    desc: "Full-stack wedding planning platform with MVC architecture, RESTful APIs, booking system, dynamic gallery with lightbox, animated testimonials, and role-based client/admin access.",
    tech: ["Express.js", "MongoDB", "REST API", "MVC", "Vanilla JS"],
    link: "https://shagunweddingplanners.vercel.app/",
  },
  {
    num: "03",
    tag: "Management Platform",
    title: "AG Healing Center",
    subtitle: "Church Management System",
    desc: "Church management platform with four core modules — Users, Appointments, Events, and Prayer Requests — featuring status lifecycle management, bcryptjs auth, and embedded Google Maps.",
    tech: ["Node.js", "Express.js", "MongoDB", "JWT", "MVC"],
    link: "#",
  },
  {
    num: "04",
    tag: "Portfolio / Showcase",
    title: "Portfolio",
    subtitle: "Developer Showcase",
    desc: "A cinematic luxury single-page portfolio website showcasing full-stack projects and skills with premium animations, smooth scrolling, and editorial design aesthetics.",
    tech: ["React", "Tailwind CSS", "Animation", "Responsive"],
    link: "#",
  },
];

const SKILLS = {
  "Languages & Runtimes": ["JavaScript", "Node.js", "HTML5", "CSS3"],
  "Frameworks & Libraries": ["Express.js", "React"],
  "Databases": ["MongoDB", "MySQL"],
  "Architecture & APIs": ["REST APIs", "MVC Architecture", "JWT Auth", "bcryptjs"],
  "Design & UX": ["Responsive Design", "Mobile-First", "UI/UX Design"],
  "Tools & Practices": ["Git", "AI-Augmented Dev", "Intersection Observer API"],
};

const TIMELINE = [
  {
    year: "2019 — 2020",
    title: "Secondary Education",
    org: "East Point School, Ajmer",
    desc: "Completed matriculation with a strong academic foundation.",
  },
  {
    year: "2021 — 2022",
    title: "Senior Secondary",
    org: "East Point School, Ajmer",
    desc: "Completed senior secondary education, developing core analytical and technical thinking.",
  },
  {
    year: "2022 — 2026",
    title: "B.Tech Computer Science",
    org: "Aryabhatta College of Engineering & Research Centre, BTU",
    desc: "Pursuing a Bachelor of Technology in Computer Science Engineering. Built multiple full-stack projects — BlueCart, Shagun Wedding Planners, and AG Healing Center — demonstrating end-to-end product development capability.",
  },
  {
    year: "Ongoing",
    title: "Full-Stack Web Developer",
    org: "Independent / Freelance",
    desc: "Building production-grade web applications with modern stacks. Integrating AI-augmented workflows and exploring emerging development paradigms for scalable, high-performance applications.",
  },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealBox({ children, style: s, className = "" }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={s}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const cursorGlow = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_ITEMS.map((n) => n.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let ringX = 0, ringY = 0;
    let glowX = 0, glowY = 0;
    let animId;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      if (cursorDot.current) {
        cursorDot.current.style.left = x + "px";
        cursorDot.current.style.top = y + "px";
      }
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      glowX += (x - glowX) * 0.06;
      glowY += (y - glowY) * 0.06;
    };

    const animate = () => {
      if (cursorRing.current) {
        cursorRing.current.style.left = ringX + "px";
        cursorRing.current.style.top = ringY + "px";
      }
      if (cursorGlow.current) {
        cursorGlow.current.style.left = glowX + "px";
        cursorGlow.current.style.top = glowY + "px";
      }
      animId = requestAnimationFrame(animate);
    };

    const onEnter = () => document.body.classList.add("hovering");
    const onLeave = () => document.body.classList.remove("hovering");

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button, .project-card, .skill-tag").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    animId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <style>{style}</style>

      {/* CURSOR */}
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className="cursor-ring" />
      <div ref={cursorGlow} className="cursor-glow" />

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">GS<span>.</span></a>
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={activeSection === item.toLowerCase() ? "active" : ""}
                onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <a 
          href="https://docs.google.com/document/d/12JfyfcgEedLbT5OeAVwrmDzqne1V2lY_3PefBB0AY1k/export?format=pdf" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-resume"
        >
          ↓ Resume
        </a>
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={menuOpen ? { transform: "rotate(45deg) translate(4px, 4px)" } : {}} />
          <span style={menuOpen ? { opacity: 0 } : {}} />
          <span style={menuOpen ? { transform: "rotate(-45deg) translate(4px, -4px)" } : {}} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)",
          zIndex: 999, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 32,
        }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              style={{
                fontFamily: "var(--font-display)", fontSize: "2.5rem",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--white)", background: "none", border: "none",
                cursor: "none", transition: "color 0.3s ease",
              }}
              onMouseEnter={e => e.target.style.color = "var(--red)"}
              onMouseLeave={e => e.target.style.color = "var(--white)"}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />
        <div className="hero-content">
          <div className="hero-left">
            <p className="hero-tag">Full-Stack Web Developer</p>
            <h1 className="hero-title">
              Gantavya<br />
              <span className="line-red">Singh</span>
            </h1>
            <p className="hero-subtitle">
              Aspiring Web developer and a fresher crafting responsive, scalable web experiences — from REST APIs to modern UIs, end-to-end.
            </p>
            <div className="hero-ctas">
              <a
                href="#projects"
                className="btn-primary"
                onClick={(e) => { e.preventDefault(); scrollTo("projects"); }}
              >
                <span>View Projects</span>
              </a>
              <a
                href="#contact"
                className="btn-outline"
                onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-frame">
              <img 
                src="https://i.postimg.cc/6prQNtHm/Gemini-Generated-Image-khoj66khoj66khoj.png" 
                alt="Gantavya Singh" 
                className="hero-image" 
              />
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about" id="about">
        <div className="section-inner">
          <RevealBox>
            <p className="section-label">About</p>
            <h2 className="section-title">The Developer</h2>
          </RevealBox>
          <div className="about-grid">
            <div className="about-left">
              <RevealBox style={{ transitionDelay: "0.1s" }}>
                <p className="about-text">
                  Building digital experiences that are <em>clean, purposeful, and user-focused</em> — not just functional.
                </p>
                <p className="about-text-body">
                  I'm a Computer Science Engineering student at Aryabhatta College of Engineering & Research Centre, graduating in 2026. My work spans the full stack — from architecting MongoDB schemas and building secure Express.js APIs, to crafting responsive mobile-first frontends with vanilla HTML, CSS, and JavaScript.
                </p>
                <p className="about-text-body">
                  I bring a continuous-learning mindset, strong problem-solving ability, and a genuine interest in AI-augmented development. Every project I ship is an exercise in clean architecture, performance, and real-world usability.
                </p>
              </RevealBox>
              <RevealBox style={{ transitionDelay: "0.2s" }}>
                <div className="about-stats">
                  <div className="stat-item">
                    <div className="stat-num">3+</div>
                    <div className="stat-label">Full-Stack Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">4</div>
                    <div className="stat-label">Core Technologies</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">2026</div>
                    <div className="stat-label">Graduating</div>
                  </div>
                </div>
              </RevealBox>
            </div>
            <div className="about-right">
              <RevealBox style={{ transitionDelay: "0.25s" }}>
                <ul className="expertise-list">
                  {[
                    ["Full-Stack Development", "End-to-end web applications from database design to deployed UI."],
                    ["Frontend & UI/UX", "Modern, interactive, mobile-first interfaces with clean design principles."],
                    ["Backend & REST APIs", "Scalable server-side logic, authentication systems, and secure API design."],
                    ["Database Management", "MongoDB and MySQL — schema design, CRUD, and aggregate operations."],
                    ["AI-Augmented Development", "Integrating AI tools into development workflows and web applications."],
                  ].map(([name, desc], i) => (
                    <li className="expertise-item" key={i}>
                      <span className="expertise-num">0{i + 1}</span>
                      <div className="expertise-content">
                        <div className="expertise-name">{name}</div>
                        <div className="expertise-desc">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </RevealBox>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section projects" id="projects">
        <div className="section-inner">
          <RevealBox>
            <p className="section-label">Selected Work</p>
            <h2 className="section-title">Projects</h2>
          </RevealBox>
          <RevealBox style={{ transitionDelay: "0.15s" }}>
            <div className="projects-grid">
              {PROJECTS.map((p) => (
                <div className="project-card" key={p.num}>
                  <div className="project-num">{p.num}</div>
                  <p className="project-tag">{p.tag}</p>
                  <h3 className="project-title">{p.title}</h3>
                  <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--grey-text)", marginBottom: 16 }}>{p.subtitle}</p>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tech">
                    {p.tech.map((t) => (
                      <span className="tech-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project <span className="project-link-arrow">→</span>
                  </a>
                </div>
              ))}
            </div>
          </RevealBox>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section skills" id="skills">
        <div className="section-inner">
          <RevealBox>
            <p className="section-label">Capabilities</p>
            <h2 className="section-title">Skills</h2>
          </RevealBox>
          <RevealBox style={{ transitionDelay: "0.1s" }}>
            <p className="skills-intro">
              A focused, practical toolkit — every technology below has been applied in production-level projects. No checkbox skills; only things I've actually shipped with.
            </p>
          </RevealBox>
          <div className="skills-categories">
            {Object.entries(SKILLS).map(([cat, tags], ci) => (
              <RevealBox key={cat} style={{ transitionDelay: `${0.1 + ci * 0.07}s` }}>
                <div className="skill-category">
                  <p className="skill-category-title">{cat}</p>
                  <div className="skill-tags">
                    {tags.map((t) => (
                      <div className="skill-tag" key={t}>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealBox>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section journey" id="journey">
        <div className="section-inner">
          <RevealBox>
            <p className="section-label">Timeline</p>
            <h2 className="section-title">Journey</h2>
          </RevealBox>
          <RevealBox style={{ transitionDelay: "0.15s" }}>
            <div className="timeline">
              {TIMELINE.map((item, i) => (
                <div className="timeline-item" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="timeline-dot" />
                  <p className="timeline-year">{item.year}</p>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-org">{item.org}</p>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealBox>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="section-inner">
          <RevealBox>
            <p className="section-label">Get In Touch</p>
            <h2 className="section-title">Contact</h2>
          </RevealBox>
          <div className="contact-grid">
            <div className="contact-left">
              <RevealBox style={{ transitionDelay: "0.1s" }}>
                <p className="contact-intro">
                  Whether it's a project collaboration, an opportunity, or just a conversation about web development — I'm open to it.
                </p>
                <div className="contact-info">
                  <div className="contact-info-item">
                    <span className="contact-info-label">Email</span>
                    <span className="contact-info-value">jyotiyanagantavya@gmail.com</span>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-label">Phone</span>
                    <span className="contact-info-value">+91 8955813948</span>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-label">Location</span>
                    <span className="contact-info-value">Ajmer, Rajasthan, India</span>
                  </div>
                  <div className="contact-info-item">
                    <span className="contact-info-label">Status</span>
                    <span className="contact-info-value" style={{ color: "var(--red)" }}>Open to Opportunities</span>
                  </div>
                </div>
              </RevealBox>
            </div>
            <div className="contact-right">
              <RevealBox style={{ transitionDelay: "0.2s" }}>
                {formSent ? (
                  <div style={{
                    border: "1px solid var(--red)", padding: 40,
                    textAlign: "center",
                  }}>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--red)", marginBottom: 12 }}>Message Sent</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--grey-text)" }}>Thank you for reaching out. I'll respond soon.</p>
                  </div>
                ) : (
                  <form className="contact-form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <input
                        className="form-input"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                      <div className="form-line" />
                    </div>
                    <div className="form-group">
                      <input
                        className="form-input"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                      />
                      <div className="form-line" />
                    </div>
                    <div className="form-group">
                      <textarea
                        className="form-textarea"
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleFormChange}
                        required
                      />
                      <div className="form-line" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: 8, border: "none", cursor: "none" }}>
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </RevealBox>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">GS<span>.</span></div>
        <p className="footer-copy">© 2024 Gantavya Singh. All rights reserved.</p>
        <div className="footer-socials">
          <a href="mailto:jyotiyanagantavya@gmail.com" className="social-link">Email</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}
