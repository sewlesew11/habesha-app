import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from '../../node_modules/react-router-dom/dist/index';

export default function AdminRoutes({ component: Component, ...rest }) {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    return (
        userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/signin" />



    );
}