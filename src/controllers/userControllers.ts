import { RequestHandler } from "express";
import { createUserService, createUsersService, deleteUserService, deleteUsersService, getAllUsersService, updateUserService } from "../services/userServices.js";
import { prisma } from "../lib/prisma.js";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../configs/jwt.js";
import jwt from 'jsonwebtoken';
import { Prisma } from "@prisma/client";

export const createUserController: RequestHandler = async (req, res) => {
    try {
        const { user, token } = await createUserService(req.body);
        return res.status(201).json({ user, accessToken: token });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') { 
                return res.status(409).json({ 
                    error: "Email já está em uso.",
                    field: error.meta?.target
                });
            }
        }
        return res.status(400).json({ error: error.message });
    }
}

export const refreshTokenController: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token missing" });
    }

    try {
        const stored = await prisma.user.findFirst({
            where: { refreshToken }
        });

        if (!stored) return res.status(403).json({ error: "Invalid refresh token" });

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: number };

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ error: "Invalid refresh token" });
    }
};

export const createUsersController: RequestHandler = async (req, res) => {
    try {
        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ 
                error: "Corpo inválido. Esperado um array [].",
                received: typeof req.body 
            });
        }

        const count = await createUsersService(req.body);
        return res.status(201).json({ count });

    } catch (error) {
        console.error("Erro no Controller de Massa:", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}

export const getAllUsersController: RequestHandler = async (req, res) => {
    try {
        let pageQuery = req.query.page;
       
        let page = 1;

        if(page) {
            const pageValue = Array.isArray(pageQuery) ? pageQuery[0] : pageQuery;
            
            const pageNumber = parseInt(pageValue as string);

            if (!isNaN(pageNumber) && pageNumber > 0) {
                page = pageNumber;
            }
        }

        const allUsers = await getAllUsersService(page);
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching users" });
    }
};

export const deleteUserController: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const deleted = await deleteUserService(id);
        return res.status(200).json({ deleted });
    } catch (error) {
        return res.status(500).json({ error: "Error deleting user" });
    }
};

export const deleteUsersController: RequestHandler = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "IDs must be a non-empty array" });
        }

        const result = await deleteUsersService(ids);

        return res.status(200).json({
            deletedCount: result.count
        });

    } catch (error) {
        return res.status(500).json({ error: "Error deleting users" });
    }
};

export const updateUserController: RequestHandler = async (req, res) => {
    try {
        const { email, name } = req.body;
        const result = await updateUserService(email, name);
        return res.status(201).json({ updatedUser: result });
    }catch (error) {
        return res.status(500).json({ error: "Error updating user" });
    }
}