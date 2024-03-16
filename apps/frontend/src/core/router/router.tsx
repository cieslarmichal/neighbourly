import { rootRoute } from '../../routes/root';
import { landingRoute } from '../../routes/landing/landing';
import { loginRoute } from '../../routes/login/login';
import { registerRoute } from '../../routes/register/register';
import { resetPasswordRoute } from '../../routes/resetPassword/resetPassword';
import { newPasswordRoute } from '../../routes/newPassword/newPassword';
import { verifyEmailRoute } from '../../routes/verifyEmail/verifyEmail';

export const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  registerRoute,
  resetPasswordRoute,
  newPasswordRoute,
  verifyEmailRoute,
]);
