import React from 'react';
import { useStoreSelector } from '../../store/hooks/useStoreSelector.js';
import { Navigate } from '@tanstack/react-router';
import { userStateSelectors } from '../../store/states/userState/userStateSlice.js';

interface RequireAuthComponentProps {
  children: React.ReactNode;
}

export function RequireAuthComponent({ children }: RequireAuthComponentProps): React.ReactNode {
  const accessToken = useStoreSelector(userStateSelectors.selectAccessToken);

  const refreshToken = useStoreSelector(userStateSelectors.selectRefreshToken);

  return accessToken && refreshToken ? <>{children}</> : <Navigate to="/login" />;
}
