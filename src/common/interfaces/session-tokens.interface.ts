export interface SessionTokens extends Request {
  session: {
    access_token?: string;
    refresh_token?: string;
    // Add other session properties if needed
  };
}
