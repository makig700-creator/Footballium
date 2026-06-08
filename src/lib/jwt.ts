import { SignJWT, jwtVerify } from "jose";

// To make this edge-compatible we use `jose`
// For local development, fallback values are provided, but normally these should be in .env

const getSecret = (type: "access" | "refresh") => {
  const secret = type === "access" 
    ? (process.env.JWT_ACCESS_SECRET || "fallback_access_secret_123") 
    : (process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_123");
  return new TextEncoder().encode(secret);
};

export type JWTPayload = {
  userId: string;
  role: string;
};

export async function signToken(payload: JWTPayload, type: "access" | "refresh") {
  const secret = getSecret(type);
  const expiresIn = type === "access" ? "15m" : "7d";

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string, type: "access" | "refresh"): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(type));
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}
