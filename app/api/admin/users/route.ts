import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isSuperAdmin } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const usersPath = path.join(process.cwd(), "app/data/users.json");

export async function GET() {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!fs.existsSync(usersPath)) {
            // Create the file with default admin if it doesn't exist
            const defaultUsers = [
                {
                    id: "master-admin-001",
                    username: "Super Admin",
                    email: "premproperties195@gmail.com",
                    password: "admin123",
                    role: "super_admin",
                    permissions: ["all"],
                    createdAt: new Date().toISOString()
                }
            ];
            fs.mkdirSync(path.dirname(usersPath), { recursive: true });
            fs.writeFileSync(usersPath, JSON.stringify(defaultUsers, null, 2));
        }

        const data = fs.readFileSync(usersPath, "utf-8");
        const users = data ? JSON.parse(data) : [];

        // Don't return passwords
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

        if (!fs.existsSync(usersPath)) {
            fs.mkdirSync(path.dirname(usersPath), { recursive: true });
            fs.writeFileSync(usersPath, JSON.stringify([], null, 2));
        }

        const rawData = fs.readFileSync(usersPath, "utf-8");
        const users = rawData ? JSON.parse(rawData) : [];

        // Basic validation
        if (!newUser.email || !newUser.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (users.find((u: any) => u.email === newUser.email)) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const userToAdd = {
            ...newUser,
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

export async function DELETE(request: Request) {
    try {
        if (!await isSuperAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await request.json();

        if (!fs.existsSync(usersPath)) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

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
