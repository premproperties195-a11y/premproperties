import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/company.json");

export async function GET() {
    try {
        if (!await hasPermission("Team")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!fs.existsSync(dataPath)) return NextResponse.json([]);

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return NextResponse.json(data.team || []);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Team Error:", error);
        return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        if (!await hasPermission("Team")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const updatedTeam = await request.json();

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: "Data file missing" }, { status: 404 });
        }

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        data.team = updatedTeam;

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("PUT Team Error:", error);
        return NextResponse.json({ error: "Failed to update team" }, { status: 500 });
    }
}
