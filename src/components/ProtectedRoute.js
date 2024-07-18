import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAdminAuth from '../store/useAdminAuth';


const ProtectedRoute = ({children,route}) => {

    const isLoggedIn = useAdminAuth((state) => state.isLoggedIn);
    let location = useLocation();

    if(!isLoggedIn) {
        return <Navigate to="/admin-login" state={{ from: location}} replace />
    }
 return children

};


export default ProtectedRoute;
