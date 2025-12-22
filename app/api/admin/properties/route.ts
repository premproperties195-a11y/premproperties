import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/properties.json");

export async function GET() {
    try {
        if (!await hasPermission("Properties")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(path.dirname(dataPath), { recursive: true });
            fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
        }
        const data = fs.readFileSync(dataPath, "utf-8");
        return NextResponse.json(data ? JSON.parse(data) : []);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Properties Error:", error);
        return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await hasPermission("Properties")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const newProperty = await request.json();

        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(path.dirname(dataPath), { recursive: true });
            fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
        }

        const rawData = fs.readFileSync(dataPath, "utf-8");
        const data = rawData ? JSON.parse(rawData) : [];

        // Generate new ID
        const maxId = Math.max(...data.map((p: any) => parseInt(p.id)), 0);
        newProperty.id = String(maxId + 1);

        data.push(newProperty);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json(newProperty);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("POST Properties Error:", error);
        return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
    }
}
