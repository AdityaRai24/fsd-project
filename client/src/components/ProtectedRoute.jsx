import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // Wrong role, redirect to appropriate dashboard
    return <Navigate to={userRole === 'student' ? '/student-dashboard' : '/teacher-dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute; 