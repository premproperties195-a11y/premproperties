import { NextResponse } from "next/server";
import { hasPermission } from "../../../lib/auth";
import { fetchCompanyData, fetchPropertiesData } from "../../../lib/data";
import { supabase } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        if (!await hasPermission("Gallery")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [companyData, propertiesData] = await Promise.all([
            fetchCompanyData(),
            fetchPropertiesData()
        ]);

        const generalImages = companyData?.galleryImages || [];

        const propertyImages: any[] = [];
        const seenUrls = new Set<string>();

        propertiesData.forEach((prop: any) => {
            // Add main image if exists
            if (prop.image && !seenUrls.has(prop.image)) {
                propertyImages.push({
                    url: prop.image,
                    type: 'property',
                    propertyTitle: prop.title,
                    propertyId: prop.id,
                    isMain: true
                });
                seenUrls.add(prop.image);
            }

            // Add gallery images
            (prop.images || []).forEach((url: string) => {
                if (url && !seenUrls.has(url)) {
                    propertyImages.push({
                        url,
                        type: 'property',
                        propertyTitle: prop.title,
                        propertyId: prop.id,
                        isMain: false
                    });
                    seenUrls.add(url);
                }
            });
        });

        return NextResponse.json({
            general: generalImages.map((url: string) => ({ url, type: 'general' })),
            properties: propertyImages
        });
    } catch (error: any) {
        console.error("GET Gallery Error:", error);
        return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await hasPermission("Gallery")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { images } = await request.json();

        // Get existing data to merge
        const { data: existing } = await supabase
            .from("site_content")
            .select("data")
            .eq("id", "company")
            .single();

        const updatedData = {
            ...(existing?.data || {}),
            galleryImages: images
        };

        const { error } = await supabase
            .from("site_content")
            .upsert({
                id: "company",
                data: updatedData,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST Gallery Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update gallery" }, { status: 500 });
    }
}
