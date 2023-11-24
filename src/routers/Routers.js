import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home';
import Shop from '../pages/Shop';
import Cart from '../pages/Cart';
import ProductDetails from '../pages/ProductDetails';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Aboutus from '../pages/Aboutus';
import ContactUs from '../pages/ContactUs';
import ProtectedRoute from './ProtectedRoute';
import PrivacyPolicy from '../pages/privacypolicy';
import TermsAndConditions from '../pages/termsandconditions';
import ShippingAndReturn from '../pages/ShippingAndReturn';
import Fav from '../pages/Fav';
import OrderPlaced from '../pages/orderPlaced';
import Payment from '../pages/Payment';
import Saree from '../pages/Saree';
import Gown from '../pages/Gown';
import Kurti from '../pages/Kurti';
import Lehanga from '../pages/Lehanga';
import Stitched from '../pages/Stitched';
import Unstitched from '../pages/Unstitched';
import Sharara from '../pages/Sharara'
import MyOrders from '../pages/myOrders';
import OrderDetails from '../pages/OrderDetails';
import NotFound from '../pages/NotFound';


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="shop/:id" element={<ProductDetails />} />
      <Route path="cart" element={<Cart />} />

      <Route path="/*" element={<ProtectedRoute />}>
        <Route path="checkout" element={<Checkout />} />
        <Route path="myorders" element={<MyOrders />} />
        <Route path="orderDetails/:orderId" element={<OrderDetails />} />
      </Route>

      <Route path="fav" element={<Fav />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="aboutus" element={<Aboutus />} />
      <Route path="contactus" element={<ContactUs />} />
      <Route path="privacypolicy" element={<PrivacyPolicy />} />
      <Route path="termsandconditions" element={<TermsAndConditions />} />
      <Route path="shippingandreturn" element={<ShippingAndReturn />} />
      <Route path="orderplaced" element={<OrderPlaced />} />
      <Route path="payment" element={<Payment />} />
      <Route path="saree" element={<Saree />} />
      <Route path="gown" element={<Gown />} />
      <Route path="kurti" element={<Kurti />} />
      <Route path="lehanga" element={<Lehanga />} />
      <Route path="stitched" element={<Stitched />} />
      <Route path="unstitched" element={<Unstitched />} />
      <Route path="sharara" element={<Sharara />} />

      <Route path='insta/*' element={<Navigate to="https://www.instagram.com/aandm_fashion_retailor/?hl=en" target="_blank" replace />} />

      {/* 404 Page Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
