export interface RefreshUserTokensRequestBody {
  readonly refreshToken: string;
}

export interface RefreshUserTokensResponseBody {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}
