import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { hasPermission } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "app/data/company.json");

export async function GET() {
    try {
        if (!await hasPermission("Settings")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!fs.existsSync(dataPath)) return NextResponse.json({});

        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return NextResponse.json({
            banners: data.banners,
            company: data.company,
            appearance: data.appearance,
            seo: data.seo,
            footer: data.footer,
        });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("GET Settings Error:", error);
        return NextResponse.json({ error: error.message || "Failed to load settings" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await hasPermission("Settings")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { banners, navigation, appearance, seo, footer } = await request.json();
        const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        data.banners = banners;
        data.navigation = navigation;
        data.appearance = appearance;
        data.seo = seo;
        data.footer = footer;

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message?.includes('NEXT_STATIC_GEN_BAILOUT') || error.code === 'NEXT_STATIC_GEN_BAILOUT') {
            throw error;
        }
        console.error("PUT Settings Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
    }
}
