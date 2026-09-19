import React from "react";
import "./App.css";
import AboutUs from "./AboutUs";
import ProductList from "./ProductList";
import CartItem from "./CartItem";

export default function App() {
  return (
    <>
      <main className="landing-page" id="home">
        <section className="hero-card">
          <h1>Paradise Nursery</h1>
          <p>
            Bring nature home with beautiful, healthy houseplants for every
            room, desk, and living space.
          </p>
          <a className="get-started" href="#plants">Get Started</a>
        </section>
      </main>
      <AboutUs />
      <ProductList />
      <CartItem />
    </>
  );
}
