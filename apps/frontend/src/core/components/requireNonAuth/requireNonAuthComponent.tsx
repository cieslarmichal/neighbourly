import { Navigate } from '@tanstack/react-router';
import { useStoreSelector } from '../../store/hooks/useStoreSelector';
import { userStateSelectors } from '../../store/states/userState/userStateSlice';

interface Props {
  children: React.ReactNode;
}

export function RequireNonAuthComponent({ children }: Props): React.ReactNode {
  const accessToken = useStoreSelector(userStateSelectors.selectAccessToken);

  const refreshToken = useStoreSelector(userStateSelectors.selectRefreshToken);

  return !accessToken && !refreshToken ? (
    <>{children}</>
  ) : (
    <Navigate to="/test1" />
  );
}
