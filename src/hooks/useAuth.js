import { useAuthContext } from '../context/AuthContext.jsx';

/**
 * Custom hook to access auth actions and state
 * @returns {Object} Auth state and actions
 */
export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    user: context.user,
    token: context.token,
    login: context.login,
    signup: context.signup,
    logout: context.logout,
    refreshUser: context.refreshUser,
    loading: context.loading,
    isAuthenticated: !!context.token
  };
};

export default useAuth;