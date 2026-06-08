import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, getCartTotal, getCartSavings } = useCart();
  const navigate = useNavigate();

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty" style={{ width: '100%' }}>
          <span className="cart-empty-icon">🛒</span>
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <button
  className="shop-now-btn"
  onClick={() => navigate('/products')}
>
  Shop Now
</button>        </div>
      </div>
    );
  }

  const total = getCartTotal();
  const savings = getCartSavings();
  const delivery = total >= 500 ? 0 : 40;

  return (
    <div className="cart-page">
      <div className="cart-items-section">
        <div className="cart-header">
          <h2>My Cart ({cartItems.length})</h2>
        </div>

        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div>
              <div className="cart-item-image" onClick={() => navigate(`/product/${item.product_id}`)}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-qty-control" style={{ marginTop: 16 }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
              </div>
            </div>

            <div className="cart-item-details">
              <h3 className="cart-item-name" onClick={() => navigate(`/product/${item.product_id}`)}>
                {item.name}
              </h3>
              <div className="cart-item-brand">{item.brand}</div>

              <div className="cart-item-price">
                <span className="current">{formatPrice(item.price)}</span>
                {item.original_price && item.original_price > item.price && (
                  <span className="original">{formatPrice(item.original_price)}</span>
                )}
                {item.discount > 0 && (
                  <span className="discount-text">{item.discount}% Off</span>
                )}
              </div>

              <div className="cart-item-controls">
                <button className="cart-item-remove" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="cart-place-order">
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/checkout')}>
            Place Order
          </button>
        </div>
      </div>

      <div className="cart-summary">
        <div className="cart-summary-header">Price Details</div>
        <div className="cart-summary-row">
          <span>Price ({cartItems.length} items)</span>
          <span>{formatPrice(total + savings)}</span>
        </div>
        <div className="cart-summary-row savings">
          <span>Discount</span>
          <span>− {formatPrice(savings)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery Charges</span>
          <span style={{ color: delivery === 0 ? 'var(--success)' : 'inherit' }}>
            {delivery === 0 ? 'Free' : formatPrice(delivery)}
          </span>
        </div>
        <hr className="cart-summary-divider" />
        <div className="cart-summary-total">
          <span>Total Amount</span>
          <span>{formatPrice(total + delivery)}</span>
        </div>
        {savings > 0 && (
          <div style={{ padding: '12px 20px', color: 'var(--success)', fontWeight: 600, fontSize: 13, borderTop: '1px solid var(--border-light)' }}>
            You will save {formatPrice(savings)} on this order
          </div>
        )}
      </div>
    </div>
  );
}
