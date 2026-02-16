import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { type RootState } from '../../../core/store/store';


export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return !isAuthenticated
        ? <>{children}</>
        : <Navigate to="/dashboard" replace />
};
