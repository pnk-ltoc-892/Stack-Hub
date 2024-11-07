import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'


// ! Further Simply The Routing

const CheckAuth = ({ isAuthenticated, user, children }) => {

    // const { isAuthenticated, user } = useSelector(state => state.auth)

    const location = useLocation()
    // console.log(location);
    // either we are on, "/" or "/auth" or "/shop" or "/admin" - Possible Routes

    if (location.pathname === "/") {
        if (!isAuthenticated) {
            return <Navigate to="/auth/login" />;
        }
        else if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        }
        else {
            return <Navigate to="/shop/home" />;
        }
    }


    // If user not authenticated, and Is on pages other than login / register, Redirect to '/auth/login'
    if (!isAuthenticated
        && !(location.pathname.includes('/login')
            || location.pathname.includes('/register'))) {
        return <Navigate to={'/auth/login'} />
    }

    // User is authenticated, Redirect to respective role page
    if (isAuthenticated
        && (location.pathname.includes('/login')
            || location.pathname.includes('/register'))) {
        if (user?.role === 'admin') {
            return <Navigate to={'/admin/dashboard'} />
        }
        else {
            return <Navigate to={'/shop/home'} />
        }
    }

    if (isAuthenticated
        && user?.role !== 'admin'
        && location.pathname.includes('/admin')) {
        return <Navigate to={'/unauth-page'} />
    }

    if (isAuthenticated
        && user?.role === 'admin'
        && location.pathname.includes('/shop')) {
        return <Navigate to={'/admin/dashboard'} />
    }

    // Render the Children If User is on the correct route
    return <>{children}</>;
}


export default CheckAuth
