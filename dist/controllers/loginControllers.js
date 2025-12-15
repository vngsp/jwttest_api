import { loginService, updateRefreshTokenService } from "../services/loginServices.js";
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tokens = await loginService(email, password);
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 15
        });
        return res.status(200).json({
            message: "Logged in",
            authToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }
    catch (error) {
        return res.status(401).json({ error: error.message });
    }
};
export const updateRefreshTokenController = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.sendStatus(401).json({ message: "Refresh token is required" });
    try {
        const tokens = await updateRefreshTokenService(refreshToken);
        return res.json(tokens);
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token session' });
    }
};
