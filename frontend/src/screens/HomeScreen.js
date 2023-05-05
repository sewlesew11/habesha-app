

import Product from '../components/product';
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from "../action/productActions";
import { useEffect } from 'react';




export default function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;


    useEffect(() => {
        dispatch(listProducts());


    }, []);
    return (
        <div>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div className="row center">
                    {products.map((product) => (
                        <Product key={product._id} product={product}></Product>
                    ))}

                </div>
            )}
        </div>
    );
};