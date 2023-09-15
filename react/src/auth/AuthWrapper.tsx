import { ReactNode, useEffect } from 'react';
import useUserStore from '../store/useUser';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

const privateRoutes = ['/notes'];

const AuthWrapper = ({ children }: Props) => {
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !privateRoutes.find((path) => path !== pathname)) {
      navigate('/login');
    }
  }, [user, navigate, pathname]);

  return <>{children}</>;
};

export default AuthWrapper;
