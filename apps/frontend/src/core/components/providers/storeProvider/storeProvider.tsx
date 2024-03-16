import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import { ReactNode } from '@tanstack/react-router';
import { userStateActions } from '../../../store/states/userState/userStateSlice';
import { CookieService } from '../../../services/cookieService/cookieService';

interface Props {
  children: ReactNode;
}

// eslint-disable-next-line no-empty-pattern
export const StoreProvider = ({ children }: Props): JSX.Element => {
  const userData = CookieService.getUserDataCookie();

  if (userData && userData !== '') {
    const user = JSON.parse(userData);

    store.dispatch(userStateActions.setCurrentUser(user));
  }

  const userTokens = CookieService.getUserTokensCookie();

  if (userTokens && userTokens !== '') {
    const tokens = JSON.parse(userTokens);

    store.dispatch(userStateActions.setCurrentUserTokens(tokens));
  }

  return <Provider store={store}>{children}</Provider>;
};
