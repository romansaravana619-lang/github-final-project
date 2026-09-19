import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "./CartSlice";

const plants = [
  { id: 1, category: "Air Purifying Plants", name: "Snake Plant", price: 499, image: "https://placehold.co/400x300?text=Snake+Plant" },
  { id: 2, category: "Air Purifying Plants", name: "Peace Lily", price: 599, image: "https://placehold.co/400x300?text=Peace+Lily" },
  { id: 3, category: "Air Purifying Plants", name: "Spider Plant", price: 399, image: "https://placehold.co/400x300?text=Spider+Plant" },
  { id: 4, category: "Air Purifying Plants", name: "ZZ Plant", price: 699, image: "https://placehold.co/400x300?text=ZZ+Plant" },
  { id: 5, category: "Air Purifying Plants", name: "Areca Palm", price: 799, image: "https://placehold.co/400x300?text=Areca+Palm" },
  { id: 6, category: "Air Purifying Plants", name: "Boston Fern", price: 549, image: "https://placehold.co/400x300?text=Boston+Fern" },

  { id: 7, category: "Low Light Plants", name: "Chinese Evergreen", price: 649, image: "https://placehold.co/400x300?text=Chinese+Evergreen" },
  { id: 8, category: "Low Light Plants", name: "Cast Iron Plant", price: 749, image: "https://placehold.co/400x300?text=Cast+Iron+Plant" },
  { id: 9, category: "Low Light Plants", name: "Parlor Palm", price: 599, image: "https://placehold.co/400x300?text=Parlor+Palm" },
  { id: 10, category: "Low Light Plants", name: "Calathea", price: 899, image: "https://placehold.co/400x300?text=Calathea" },
  { id: 11, category: "Low Light Plants", name: "Dracaena", price: 699, image: "https://placehold.co/400x300?text=Dracaena" },
  { id: 12, category: "Low Light Plants", name: "Peperomia", price: 449, image: "https://placehold.co/400x300?text=Peperomia" },

  { id: 13, category: "Succulents", name: "Aloe Vera", price: 349, image: "https://placehold.co/400x300?text=Aloe+Vera" },
  { id: 14, category: "Succulents", name: "Echeveria", price: 299, image: "https://placehold.co/400x300?text=Echeveria" },
  { id: 15, category: "Succulents", name: "Haworthia", price: 329, image: "https://placehold.co/400x300?text=Haworthia" },
  { id: 16, category: "Succulents", name: "Jade Plant", price: 449, image: "https://placehold.co/400x300?text=Jade+Plant" },
  { id: 17, category: "Succulents", name: "String of Pearls", price: 599, image: "https://placehold.co/400x300?text=String+of+Pearls" },
  { id: 18, category: "Succulents", name: "Zebra Haworthia", price: 379, image: "https://placehold.co/400x300?text=Zebra+Haworthia" }
];

export default function ProductList() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart?.items || []);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const categories = [...new Set(plants.map(plant => plant.category))];

  return (
    <div id="plants">
      <nav className="navbar">
        <strong>Paradise Nursery</strong>
        <div>
          <a href="#home">Home</a>
          <a href="#plants">Plants</a>
          <a href="#cart">Cart 🛒 <span className="cart-count">{cartCount}</span></a>
        </div>
      </nav>

      <main className="product-page">
        <h1>Paradise Nursery Plants</h1>

        {categories.map(category => (
          <section className="category" key={category}>
            <h2>{category}</h2>
            <div className="product-grid">
              {plants
                .filter(plant => plant.category === category)
                .map(plant => {
                  const inCart = cartItems.some(item => item.id === plant.id);
                  return (
                    <article className="product-card" key={plant.id}>
                      <img src={plant.image} alt={plant.name} />
                      <h3>{plant.name}</h3>
                      <p>₹{plant.price}</p>
                      <button
                        disabled={inCart}
                        onClick={() => dispatch(addItem(plant))}
                      >
                        {inCart ? "Added to Cart" : "Add to Cart"}
                      </button>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export { plants };
