import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from "./CartSlice";

export default function CartItem() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart?.items || []);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div id="cart" className="cart-page">
      <nav className="navbar">
        <strong>Paradise Nursery</strong>
        <div>
          <a href="#home">Home</a>
          <a href="#plants">Plants</a>
          <a href="#cart">Cart</a>
        </div>
      </nav>

      <h1>Shopping Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map(item => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>Unit Price: ₹{item.price}</p>
                <p>Total Cost: ₹{item.price * item.quantity}</p>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({
                        id: item.id,
                        quantity: item.quantity - 1
                      }))
                    }
                  >
                    −
                  </button>
                  <strong>{item.quantity}</strong>
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({
                        id: item.id,
                        quantity: item.quantity + 1
                      }))
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="delete-button"
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          <section className="cart-summary">
            <h2>Total Amount: ₹{totalAmount}</h2>
            <button onClick={() => alert("Coming Soon!")}>Checkout</button>
            <button onClick={() => (window.location.hash = "plants")}>
              Continue Shopping
            </button>
          </section>
        </>
      )}
    </div>
  );
}
