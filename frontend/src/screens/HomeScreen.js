
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Product from '../components/product';
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, listTopRatedProducts, } from "../action/productActions";
import { useEffect, } from 'react';
import { Link } from 'react-router-dom';


export default function HomeScreen() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    const topRatedProducts = useSelector((state) => state.topRatedProducts);
    const {
        loading: topLoading,
        error: topError,
        products: topProducts
    } = topRatedProducts;

    useEffect(() => {
        dispatch(listProducts({}));
        dispatch(listTopRatedProducts());
    }, [dispatch]);

    return (
        <div>
            <h1>Top Rated Products</h1>
            {topLoading ? (
                <LoadingBox></LoadingBox>
            ) : topError ? (
                <MessageBox variant="danger">{topError}</MessageBox>
            ) : (
                <>
                    {topProducts.length === 0 && <MessageBox>No Product Found</MessageBox>}
                    <Carousel
                        showArrows
                        autoPlay
                        showThumbs={false}
                        infiniteLoop={true}
                        transitionDuration={1000}
                        reverse
                    >
                        {topProducts.map((product) => (
                            <div key={product._id}>
                                <Link to={`/product/${product._id}`}>
                                    <img src={`http://localhost:5000${product.image}`} alt={product.name} />
                                    <p className="legend">{product.name}</p>
                                </Link>
                            </div>
                        ))}
                    </Carousel>
                </>

            )}

            <h2>Featured Products</h2>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    {products && products.length === 0 && <MessageBox>No Product Found</MessageBox>}
                    <div className="row center">
                        {products && products.map((product) => (
                            <Product key={product._id} product={product}></Product>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};