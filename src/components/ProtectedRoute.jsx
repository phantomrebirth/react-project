import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <Route {...rest} element={element} />;
};

export default ProtectedRoute;