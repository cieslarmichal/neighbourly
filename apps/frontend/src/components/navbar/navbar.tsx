import { Link, useNavigate } from '@tanstack/react-router';
import { FC } from 'react';
import { FaUser } from 'react-icons/fa';
import { useLogoutUserMutation } from '../../api/user/mutations/logoutUserMutation/logoutUserMutation';
import { useStoreSelector } from '../../core/store/hooks/useStoreSelector';
import { userStateActions, userStateSelectors } from '../../core/store/states/userState/userStateSlice';
import { CookieService } from '../../core/services/cookieService/cookieService';
import { useFindUserQuery } from '../../api/user/queries/findUserQuery/findUserQuery';
import { useStoreDispatch } from '../../core/store/hooks/useStoreDispatch';

export const Navbar: FC = () => {
  const navigate = useNavigate();

  const { mutate: logoutUserMutation } = useLogoutUserMutation({});

  const accessToken = useStoreSelector(userStateSelectors.selectAccessToken);

  const refreshToken = useStoreSelector(userStateSelectors.selectRefreshToken);

  const res = useFindUserQuery();

  const dispatch = useStoreDispatch();

  const handleLogout = () => {
    if (!accessToken || !refreshToken || !res.data?.id) {
      return;
    }

    logoutUserMutation(
      {
        accessToken,
        id: res.data?.id,
        refreshToken,
      },
      {
        onSuccess: () => {
          CookieService.removeUserDataCookie();

          CookieService.removeUserTokensCookie();

          dispatch(userStateActions.removeUserState());

          navigate({
            to: '/login',
          });
        },
        onError: () => {
          // TODO: Think through error handling
          CookieService.removeUserDataCookie();

          CookieService.removeUserTokensCookie();

          dispatch(userStateActions.removeUserState());
        },
      },
    );
  };

  return (
    <div className="bg-white p-8 top-0 fixed flex flex-1 justify-end w-full items-center">
      <div className="w-[100%] font-semibig-clamped font-logo-bold">
        <Link to="/">neighbourly</Link>
      </div>
      <input
        type="checkbox"
        className="sm:hidden burger-input"
      ></input>
      <div className="sm:hidden">
        <span className="burger-span"></span>
        <span className="burger-span"></span>
        <span className="burger-span"></span>
      </div>
      <ul className="hidden sm:flex sm:flex-1 sm:gap-16 sm:justify-end w-full items-center">
        <li className="text-primary sm:min-w-[7rem] text-center">
          <Link
            to={'/groups'}
            className="[&.active]:font-bold"
          >
            Groups
          </Link>
        </li>
        <FaUser
          onClick={handleLogout}
          className="cursor-pointer text-2xl sm:text-4xl"
        />
      </ul>
    </div>
  );
};
