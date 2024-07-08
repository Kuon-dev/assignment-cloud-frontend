export const checkAuthCookie = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  const access_cookie = cookie
    ?.split(";")
    .find((c) => c.trim().startsWith("auth_session="));

  return access_cookie ? true : false;
};

export const getAuthTokenFromCookie = (
  cookieHeader: string | null,
): string | null => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookies["auth_token"] || null;
};
