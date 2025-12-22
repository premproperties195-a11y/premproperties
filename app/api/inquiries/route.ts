import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../lib/auth";

const dataPath = path.join(process.cwd(), "app/data/inquiries.json");

export async function GET() {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json([]);
        }
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const inquiry = await request.json();
        const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf-8")) : [];

        const newInquiry = {
            id: Date.now().toString(),
            ...inquiry,
            date: new Date().toISOString(),
            status: "new"
        };

        data.unshift(newInquiry); // Add to top
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, inquiry: newInquiry });
    } catch (error) {
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id } = await request.json();
        let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        data = data.filter((item: any) => item.id !== id);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { id, status } = await request.json();
        let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        const index = data.findIndex((item: any) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        data[index] = { ...data[index], status };
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
    }
}
