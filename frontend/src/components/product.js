import React from "react";
import { Link } from "react-router-dom";

import Rating from "./rating";



export default function Product(props) {


    const { product } = props;
    if (!product || typeof product !== "object" || !product._id) {
        return null;
    }


    return (
        <div key={product._id} className="card">
            <Link to={`/product/${product._id}`}>
                <img className="medium" src={`http://localhost:5000${product.image}`} alt={product.name}></img>
            </Link>
            <div className="card-body">
                <Link to={`/product/${product._id}`}>
                    <h2>{product.name}</h2>
                </Link>
                <Rating rating={product.rating}
                    numReviews={product.numReviews}
                ></Rating>
                <div className="price">{product.price} Birr</div>

            </div>
        </div>
    )
}
