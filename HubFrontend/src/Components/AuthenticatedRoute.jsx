import { Navigate } from "react-router-dom";
import { memo } from 'react';

const AuthenticatedRoute = ({ children }) => {

    const studentToken = localStorage.getItem("token");
    const reviewerToken = localStorage.getItem("reviewerToken");

    if (!studentToken && !reviewerToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default memo(AuthenticatedRoute);