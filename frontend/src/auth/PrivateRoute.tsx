import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
