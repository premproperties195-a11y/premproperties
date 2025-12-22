import { NextResponse } from "next/server";
import { getMemberSession } from "../../../lib/memberAuth";

export async function GET() {
    const session = await getMemberSession();
    return NextResponse.json(session || { authenticated: false });
}
