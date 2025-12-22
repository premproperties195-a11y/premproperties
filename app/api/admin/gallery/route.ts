import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/company.json");

export async function GET() {
    try {
        if (!await hasPermission("Gallery")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!fs.existsSync(dataPath)) return NextResponse.json([]);

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return NextResponse.json(data.galleryImages || []);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Gallery Error:", error);
        return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await hasPermission("Gallery")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { url } = await request.json();
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        if (!data.galleryImages) data.galleryImages = [];
        data.galleryImages.unshift(url);

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, url });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("POST Gallery Error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload to gallery" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await hasPermission("Gallery")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { url } = await request.json();
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        data.galleryImages = (data.galleryImages || []).filter((i: string) => i !== url);

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("DELETE Gallery Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete from gallery" }, { status: 500 });
    }
}
