import "dotenv/config";

export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");
if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET must be defined");