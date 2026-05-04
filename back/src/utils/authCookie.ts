import { CookieOptions, Request, Response } from "express";

const parseBooleanEnv = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value.toLowerCase().trim() === "true";
};

const getSameSite = (): CookieOptions["sameSite"] => {
  const defaultValue = process.env.NODE_ENV === "production" ? "none" : "lax";
  const value = (process.env.AUTH_COOKIE_SAME_SITE || defaultValue).toLowerCase().trim();

  if (value === "strict" || value === "lax" || value === "none") {
    return value;
  }

  return "lax";
};

export const getAuthCookieName = () => process.env.AUTH_COOKIE_NAME || "access_token";

export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: parseBooleanEnv(process.env.AUTH_COOKIE_SECURE, process.env.NODE_ENV === "production"),
  sameSite: getSameSite(),
  maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE_MS || 24 * 60 * 60 * 1000),
  path: "/",
});

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(getAuthCookieName(), token, getAuthCookieOptions());
};

export const clearAuthCookie = (res: Response) => {
  const { maxAge, expires, ...clearOptions } = getAuthCookieOptions();
  void maxAge;
  void expires;

  res.clearCookie(getAuthCookieName(), clearOptions);
};

const parseCookieHeader = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, part) => {
    const trimmed = part.trim();
    if (!trimmed) return cookies;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return cookies;

    const name = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    try {
      cookies[name] = decodeURIComponent(value);
    } catch (_error) {
      cookies[name] = value;
    }

    return cookies;
  }, {});
};

export const getAuthTokenFromCookie = (req: Request): string | null => {
  const cookies = parseCookieHeader(req.headers.cookie);
  return cookies[getAuthCookieName()] || null;
};
