import { prisma } from "../lib/prisma.js";
import { JWT_SECRET } from "../configs/jwt.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const createUserService = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true
        }
    });
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '15min',
    });
    return { user, token };
};
export const createUsersService = async (usersData) => {
    const usersWithHashedPasswords = await Promise.all(usersData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
    })));
    const result = await prisma.user.createMany({
        data: usersWithHashedPasswords,
        skipDuplicates: true
    });
    return result.count;
};
export const getAllUsersService = async (page = 1) => {
    let take = 25;
    let skip = (page - 1) * take;
    return prisma.user.findMany({
        skip,
        take
    });
};
export const deleteUserService = async (id) => {
    return prisma.user.delete({
        where: {
            id,
        },
        select: {
            id: true,
            name: true
        }
    });
};
export const deleteUsersService = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('The ids array cannot be empty');
    }
    return prisma.user.deleteMany({
        where: {
            id: {
                in: ids,
            }
        }
    });
};
export const updateUserService = async (email, name) => {
    return prisma.user.update({
        where: {
            email
        },
        data: {
            name
        },
        select: {
            name: true,
            email: true
        }
    });
};
