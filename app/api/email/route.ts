import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { to, subject, message } = body
}