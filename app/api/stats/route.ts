import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const propertiesPath = path.join(process.cwd(), "app/data/properties.json");
        const companyPath = path.join(process.cwd(), "app/data/company.json");

        const properties = JSON.parse(fs.readFileSync(propertiesPath, "utf-8"));
        const company = JSON.parse(fs.readFileSync(companyPath, "utf-8"));

        const totalViews = properties.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

        return NextResponse.json({
            properties: properties.length,
            team: company.team.length,
            views: totalViews,
        });
    } catch (error) {
        return NextResponse.json(
            { properties: 0, team: 0, views: 0 },
            { status: 500 }
        );
    }
}
