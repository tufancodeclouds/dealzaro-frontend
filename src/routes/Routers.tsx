import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from '../pages/Home';
import Collection from '../pages/Collection';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Product from '../pages/Product';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import PlaceOrder from '../pages/PlaceOrder';
import Orders from '../pages/Orders';
import Verify from '../pages/Verify';
import ProtectedRoute from './ProtectedRoute';

const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/collection' element={<Collection />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/product/:productId' element={<Product />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<Login />} />
      <Route path='/place-order' element={
        <ProtectedRoute>
          <PlaceOrder />
        </ProtectedRoute>
      } />
      <Route path='/orders' element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path='/verify' element={
        <ProtectedRoute>
          <Verify />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default Routers;
