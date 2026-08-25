import { Navigate } from "react-router-dom";

const ReviewerProtectedRoute = ({ children }) => {
    const reviewerToken = localStorage.getItem("reviewerToken");

    if (!reviewerToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ReviewerProtectedRoute;