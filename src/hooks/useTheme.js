import { useThemeContext } from '../context/ThemeContext.jsx';

/**
 * Custom hook to access theme actions and state
 * @returns {Object} Theme state and actions
 */
export const useTheme = () => {
  const context = useThemeContext();
  
  return {
    theme: context.theme,
    toggleTheme: context.toggleTheme,
    isDark: context.theme === 'dark',
    isLight: context.theme === 'light'
  };
};

export default useTheme;