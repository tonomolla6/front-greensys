import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { isAuthenticated, user, token, login, logout, refreshToken } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuthRefresh = () => {
      if (token) {
        // Refresh token 5 minutes before expiration
        const refreshInterval = setInterval(() => {
          refreshToken().catch(() => {
            logout();
            navigate("/login");
          });
        }, 25 * 60 * 1000); // 25 minutes

        return () => clearInterval(refreshInterval);
      }
    };

    return setupAuthRefresh();
  }, [token, refreshToken, logout, navigate]);

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) ?? false;
  };

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    hasPermission,
  };
};
