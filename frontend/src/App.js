import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { signout } from './action/userActions';
import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import RegisterScreen from './screens/RegisterScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAdressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoutes from './components/PrivateRoutes';
import ProductListScreen from './screens/ProductListScreen';
import AdminRoutes from './components/AdminRoutes';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

import SearchScreen from './screens/SearchScreen';
import SearchBox from './components/SearchBox';
import { listProductCategories } from './action/productActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';
import SupportScreen from './screens/SupportScreen';
import ChatBox from './components/ChatBox';



function App() {

  const cart = useSelector(state => state.cart);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const { cartItems } = cart;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const signoutHandler = () => {
    dispatch(signout());
  };
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <button
              type="button"
              className="open-sidebar"
              onClick={() => setSidebarIsOpen(true)}
            >
              <i className="fa fa-bars"></i>
            </button>
            <Link className="brand" to="/">
              habesha

            </Link>
          </div>
          <div>
            <Routes>
              <Route path="/" element={<SearchBox />} />
            </Routes>


            <Routes>
              <Route
                render={({ history }) => (
                  <SearchBox history={history}></SearchBox>

                )}

              ></Route>
            </Routes>

          </div>
          <div>
            <Link to="/cart">Cart
              {cartItems.length > 0 && (
                <span className='badge'>{cartItems.length}</span>
              )}
            </Link>
            {
              userInfo ? (
                <div className="dropdown">
                  <Link
                    to="#">{userInfo.name} <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/profile">User Profile</Link>
                    </li>
                    <li>
                      <Link to="/orderhistory">Order History</Link>
                    </li>
                    <li>
                      <Link to="#signout" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </li>
                  </ul>

                </div>
              ) :
                (
                  <Link to="/signin">Sign in</Link>
                )
            }

            {
              userInfo && userInfo.isAdmin && (
                <div className="dropdown">
                  <Link to="#admin">
                    Admin <i className="fa fa-caret-down"></i>
                  </Link>
                  <ul className="dropdown-content">
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/productlist">Products</Link>
                    </li>
                    <li>
                      <Link to="/orderlist">Orders</Link>
                    </li>
                    <li>
                      <Link to="/userlist">Users</Link>
                    </li>
                    <li>
                      <Link to="/support">Support</Link>
                    </li>
                  </ul>
                </div>
              )}

          </div>
        </header>
        <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                <i className="fa fa-close"></i>
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
        <main>

          <Routes>
            {/* <Route path="/seller/:id" element={<SellerScreen />} /> */}
            <Route path="/cart/:id?" element={<CartScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} exact />
            <Route path="/product/:id/edit" element={<ProductEditScreen />} exact />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/shipping" element={<ShippingAddressScreen />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            <Route path="/search/name/:name?" element={<SearchScreen />} exact />
            <Route path="/search/category/:category" element={<SearchScreen />} exact />
            <Route path="/search/category/:category/name/:name" element={<SearchScreen />} exact />
            <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber" element={<SearchScreen />} exact />
            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/map" element={<MapScreen />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/productlist" element={<ProductListScreen />} exact />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/productlist/pageNumber/:pageNumber" element={<ProductListScreen />} exact />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/orderlist" element={<OrderListScreen />} exact />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/userlist" element={<UserListScreen />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/user/:id/edit" element={<UserEditScreen />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
            </Route>
            <Route element={<AdminRoutes />}>
              <Route path="/support" element={<SupportScreen />} />
            </Route>

            <Route path="/" element={<HomeScreen />} exact />
          </Routes>

        </main>
        <footer className="row center">
          {userInfo && !userInfo.isAdmin &&
            <ChatBox userInfo={userInfo} />
          }
          <div>All right reserved</div>{' '}
        </footer>
      </div >
    </BrowserRouter >
  );
}

export default App;
