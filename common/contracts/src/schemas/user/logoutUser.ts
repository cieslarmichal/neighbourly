export interface LogoutUserPathParams {
  readonly id: string;
}

export interface LogoutUserRequestBody {
  readonly refreshToken: string;
  readonly accessToken: string;
}
