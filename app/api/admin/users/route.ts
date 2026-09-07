import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isSuperAdmin } from "../../../lib/auth";
import { hashPassword } from "../../../lib/password";

export const dynamic = "force-dynamic";

const getUsersStoragePath = () => {
    const configuredPath = process.env.USERS_DATA_PATH;
    if (configuredPath) return configuredPath;

    return path.join("/tmp", "premproperties-users.json");
};

const migrateLegacyUserFile = () => {
    const primaryPath = getUsersStoragePath();
    const legacyPath = path.join(process.cwd(), "app", "data", "users.json");

    if (!fs.existsSync(primaryPath) && fs.existsSync(legacyPath)) {
        const legacyUsers = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
        fs.mkdirSync(path.dirname(primaryPath), { recursive: true });
        fs.writeFileSync(primaryPath, JSON.stringify(legacyUsers, null, 2));
    }

    return primaryPath;
};

const ensureUsersFile = () => {
    const storagePath = migrateLegacyUserFile();
    const storageDir = path.dirname(storagePath);

    fs.mkdirSync(storageDir, { recursive: true });

    if (!fs.existsSync(storagePath)) {
        const defaultUsers = [
            {
                id: "master-admin-001",
                username: "Super Admin",
                email: "admin@prem.com",
                password: "admin123",
                role: "super_admin",
                permissions: ["all"],
                createdAt: new Date().toISOString()
            }
        ];

        fs.writeFileSync(storagePath, JSON.stringify(defaultUsers, null, 2));
    }

    return storagePath;
};

export async function GET() {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const usersPath = ensureUsersFile();
        const data = fs.readFileSync(usersPath, "utf-8");
        const users = data ? JSON.parse(data) : [];

        const safeUsers = users.map(({ password, ...u }: any) => u);
        return NextResponse.json(safeUsers);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Users Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const newUser = await request.json();
        const usersPath = ensureUsersFile();

        const rawData = fs.readFileSync(usersPath, "utf-8");
        const users = rawData ? JSON.parse(rawData) : [];

        if (!newUser.email || !newUser.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (users.find((u: any) => u.email?.toLowerCase() === newUser.email?.toLowerCase())) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        if (!newUser.username) {
            return NextResponse.json({ error: "Full name is required" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(String(newUser.password));

        const userToAdd = {
            ...newUser,
            username: String(newUser.username).trim(),
            email: String(newUser.email).trim(),
            permissions: Array.isArray(newUser.permissions) ? newUser.permissions : [],
            role: newUser.role || "sub_admin",
            password: hashedPassword,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };

        users.push(userToAdd);
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        const { password, ...safeUser } = userToAdd;
        return NextResponse.json(safeUser);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("POST Users Error:", error);
        return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updatedUser = await request.json();
        const usersPath = ensureUsersFile();
        const rawData = fs.readFileSync(usersPath, "utf-8");
        const users = rawData ? JSON.parse(rawData) : [];

        const index = users.findIndex((user: any) => user.id === updatedUser.id);
        if (index === -1) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!updatedUser.email || !updatedUser.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const duplicate = users.find((user: any) =>
            user.id !== updatedUser.id && user.email?.toLowerCase() === updatedUser.email?.toLowerCase()
        );

        if (duplicate) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const nextPassword = String(updatedUser.password || users[index].password || "");
        const hashedPassword = nextPassword ? await hashPassword(nextPassword) : users[index].password;

        const userToUpdate = {
            ...users[index],
            ...updatedUser,
            username: String(updatedUser.username || users[index].username).trim(),
            email: String(updatedUser.email).trim(),
            permissions: Array.isArray(updatedUser.permissions) ? updatedUser.permissions : users[index].permissions || [],
            role: updatedUser.role || users[index].role || "sub_admin",
            password: hashedPassword,
        };

        users[index] = userToUpdate;
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

        const { password, ...safeUser } = userToUpdate;
        return NextResponse.json(safeUser);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("PUT Users Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();
        const usersPath = ensureUsersFile();

        const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
        const filteredUsers = users.filter((u: any) => u.id !== id);

        if (filteredUsers.length === users.length) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        fs.writeFileSync(usersPath, JSON.stringify(filteredUsers, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("DELETE Users Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
    }
}
