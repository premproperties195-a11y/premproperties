import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/properties.json");

export async function generateStaticParams() {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return data.map((p: any) => ({ id: p.id }));
    } catch (e) {
        return [];
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!await hasPermission("Properties")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        const property = data.find((p: any) => p.id === params.id);

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Property Error:", error);
        return NextResponse.json({ error: error.message || "Failed to load property" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!await hasPermission("Properties")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const updatedProperty = await request.json();
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        const index = data.findIndex((p: any) => p.id === params.id);
        if (index === -1) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        data[index] = { ...data[index], ...updatedProperty, id: params.id };
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json(data[index]);
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("PUT Property Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update property" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!await hasPermission("Properties")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        const filtered = data.filter((p: any) => p.id !== params.id);

        if (filtered.length === data.length) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("DELETE Property Error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete property" }, { status: 500 });
    }
}
