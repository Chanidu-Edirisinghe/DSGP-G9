// src/components/Hero/Hero.js
import React from "react";
import "./hero.css";

function Hero({ heading, description }) {
  return (
    <header className="hero">
      <h1>{heading}</h1>
      <p>{description}</p>
    </header>
  );
}

export default Hero;
