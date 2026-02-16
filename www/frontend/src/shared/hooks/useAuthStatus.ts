import { useSelector } from 'react-redux';
import { type RootState } from '../../core/store/store';
import { type UserRole } from '../../modules/auth/store/authSlice';

interface UseAuthStatusReturn {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  user: { username: string; role: UserRole } | null;
  isChecking: boolean;
}

export function useAuthStatus(): UseAuthStatusReturn {
  const { token, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const isChecking = !token && !user;

  return {
    isAuthenticated,
    userRole: user?.role ?? null,
    user,
    isChecking,
  };
}
