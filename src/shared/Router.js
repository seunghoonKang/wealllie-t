import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Room from '../pages/Room';
import Kakao from '../components/login/kakao';
// import Test from '../pages/Test';
import Change from '../pages/Change';
// import OvReact from '../components/OvReact';
// import RTC from '../components/RTC';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/api/auth/kakao/callback" element={<Kakao />}></Route>
        <Route path="/home" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
        {/* <Route path="/test/" element={<RTC />} /> */}
        <Route path="/change/" element={<Change />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
