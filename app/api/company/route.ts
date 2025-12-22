import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";



export async function GET() {
    try {
        const dataPath = path.join(process.cwd(), "app/data/company.json");
        const data = fs.readFileSync(dataPath, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to load company data" }, { status: 500 });
    }
}
