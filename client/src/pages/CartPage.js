import React from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  // Total price calculation
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * item.quantity; // Multiply price by quantity
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Decrease quantity of the product by 1 (Buy Now functionality)
  const decreaseQuantity = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      if (index !== -1) {
        if (myCart[index].quantity > 1) {
          myCart[index].quantity -= 1; // Decrease quantity by 1
        } else {
          myCart.splice(index, 1); // Remove item from cart if quantity is 0
        }
      }
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Decrease quantity of all items in the cart and remove items with 0 quantity
  const buyAllItems = () => {
    try {
      let myCart = [...cart];
      // Decrease quantity of each item by 1
      myCart.forEach((item) => {
        if (item.quantity > 1) {
          item.quantity -= 1; // Decrease quantity by 1
        } else {
          // Remove item if quantity reaches 0
          myCart = myCart.filter((cartItem) => cartItem._id !== item._id);
        }
      });
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Message for stock availability
  const stockMessage = (quantity) => {
    if (quantity === 0) {
      return <p className="text-danger">This product is out of stock, sorry</p>;
    } else if (quantity === 1 || quantity === 2) {
      return <p className="text-warning">Hurry up! There are only {quantity} units left.</p>;
    } else {
      return null;
    }
  };

  return (
    <Layout>
      <div className="container" style={{ backgroundColor: '#e2f1e2', minHeight: '100vh' }}>
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-3" style={{ fontWeight: '700' }}>
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center" style={{ fontSize: '1.2rem' }}>
              {cart?.length
                ? `You have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout"
                }`
                : "Your Cart Is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div key={p._id} className="row mb-3 p-3 card flex-row" style={{ backgroundColor: '#fafafa', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    width="100px"
                    height="100px"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
                <div className="col-md-8">
                  <p style={{ fontWeight: '600' }}>{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price: {p.price}</p>

                  {stockMessage(p.quantity)} {/* Show the stock message here */}
                  <button
                    className="btn btn-danger mb-2"
                    onClick={() => removeCartItem(p._id)}
                    style={{ width: '100%' }}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => decreaseQuantity(p._id)}
                    style={{ width: '100%' }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center" style={{ backgroundColor: '#fafafa', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total: {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      if (auth?.user?.role === 1) {
                        // Redirect to admin profile
                        navigate("/dashboard/admin/profile");
                      } else {
                        // Redirect to user profile
                        navigate("/dashboard/user/profile");
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    Update Address
                  </button>
                </div>
                <div className="mb-3">
                  <button
                    className="btn btn-success"
                    onClick={buyAllItems} // Call the buyAllItems function
                    style={{ width: '100%' }}
                  >
                    Buy All Items
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      if (auth?.user?.role === 1) {
                        // Redirect to admin profile
                        navigate("/dashboard/admin/profile");
                      } else {
                        // Redirect to user profile
                        navigate("/dashboard/user/profile");
                      }
                    }}
                    style={{ width: '100%' }}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                    style={{ width: '100%' }}
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
