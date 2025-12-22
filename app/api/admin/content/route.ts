import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/company.json");

export async function GET() {
    try {
        if (!await hasPermission("Content")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!fs.existsSync(dataPath)) return NextResponse.json({});

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return NextResponse.json(data.siteContent || {});
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Content Error:", error);
        return NextResponse.json({ error: error.message || "Failed to load content" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await hasPermission("Content")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const updatedContent = await request.json();
        fs.writeFileSync(dataPath, JSON.stringify(updatedContent, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("PUT Content Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update content" }, { status: 500 });
    }
}
