import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { addToCart, removeFromCart } from "../action/cartActions";
import MessageBox from "../components/MessageBox";

export default function CartScreen(props) {
    const { id } = useParams();
    const productId = id;
    const location = useLocation();
    const qty = new URLSearchParams(location.search).get("qty") ?? 1;
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const dispatch = useDispatch();

    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);
    const removeFromCartHandler = (id) => {
        // we need to implement delete action
        dispatch(removeFromCart(id));
    };
    const checkOutHandler = () => {
        window.location.href = ('/Signin?redirect=shipping');

    };
    return (

        <div className="row top">
            <div className="col-2">
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <MessageBox>
                    Cart is empty.<Link to="/">Go Shopping</Link>
                </MessageBox>
                    :
                    (
                        <ul>
                            {
                                cartItems.map((item) => (
                                    <li key={item.product}>
                                        <div className="row">
                                            <div>
                                                <img className="small" src={item.image} alt={item.name}></img>
                                            </div>
                                            <div className="min-30">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>
                                            <div>
                                                <select value={item.qty}
                                                    onChange={e =>
                                                        dispatch(
                                                            addToCart(item.product, Number(e.target.value))
                                                        )
                                                    }
                                                >
                                                    {[...Array(item.countInStock).keys()].map(
                                                        (x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <div> {item.price} birr </div>
                                            <div>
                                                <button type="button"
                                                    onClick={() => removeFromCartHandler(item.product)}
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Subtotal({parseFloat(cartItems.reduce((a, c) => parseFloat(a) + parseFloat(c.qty), 0))} items):
                                {parseFloat(cartItems.reduce((a, c) => parseFloat(a) + parseFloat(c.price) * parseFloat(c.qty), 0))} birr

                            </h2>
                        </li>
                        <li>
                            <button type="button"
                                onClick={checkOutHandler}
                                className="primary block"
                                disabled={cartItems.length === 0}
                            >
                                Proced to Checkout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
