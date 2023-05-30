import React, { useContext } from 'react'
import AppContext from '../../../store/AppContext';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 * 
 * The ProtectedRoute component display children only if user is logged in,
 * the verification is done based on `isLoggedIn' variable stored within AppContext.
 * 
 */
const ProtectedRoute = ({ redirect = "/", children }) => {
    const { isLoggedIn } = useContext(AppContext);

    return (
        <React.Fragment>
            {isLoggedIn && children}
            {!isLoggedIn && <Navigate to={redirect} replace={true}/> }
        </React.Fragment>
    );
}

export default ProtectedRoute