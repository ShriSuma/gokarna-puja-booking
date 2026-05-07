import { SignJWT, jwtVerify } from "jose";

const cookieName = "gp_admin";

function getSecret() {
  const s = process.env.SESSION_SECRET ?? "dev-only-change-me-32-characters-min";
  return new TextEncoder().encode(s.padEnd(32, "x").slice(0, 32));
}

export { cookieName as adminCookieName };

export async function signAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
