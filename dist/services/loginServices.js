import { prisma } from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../configs/jwt.js';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in the environment variables.');
}
export const loginService = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    if (!user)
        throw new Error("User not found");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
        throw new Error("Invalid password");
    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15min' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });
    return { accessToken, refreshToken };
};
export const updateRefreshTokenService = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({
        where: { id: decoded.id }
    });
    if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Invalid or expired refresh token");
    }
    const newAccessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30sec' });
    const newRefreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken }
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};
