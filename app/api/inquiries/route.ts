import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { hasPermission } from "../../lib/auth";

export async function GET() {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error("Error fetching inquiries:", error);
        return NextResponse.json({ error: "Failed to load inquiries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const inquiry = await request.json();

        const newInquiry = {
            id: Date.now().toString(),
            ...inquiry,
            date: new Date().toISOString(),
            status: "new"
        };

        const { data, error } = await supabase
            .from('inquiries')
            .insert([newInquiry])
            .select()
            .single();

        if (error) {
            console.error("Supabase inquiry insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, inquiry: data });
    } catch (error: any) {
        console.error("Inquiry submission error:", error);
        return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await request.json();

        const { error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting inquiry:", error);
        return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await hasPermission("Inquiries")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, status } = await request.json();

        const { data, error } = await supabase
            .from('inquiries')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, inquiry: data });
    } catch (error: any) {
        console.error("Error updating inquiry:", error);
        return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
    }
}
