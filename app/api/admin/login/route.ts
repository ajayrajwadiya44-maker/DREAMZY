import { NextResponse } from "next/server";
import crypto from "node:crypto";

const COOKIE_NAME = "dreamzy-admin-session";
const SESSION_DAYS = 7;

function makeSession(secret: string) {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expiresAt);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enteredPassword =
      typeof body?.password === "string" ? body.password : "";

    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

    // Keep the actual secret/password out of the response.
    if (!adminPassword) {
      console.error("DREAMZY ADMIN ERROR: ADMIN_PASSWORD is missing.");
      return NextResponse.json(
        { message: "Admin password is not configured on the server." },
        { status: 500 }
      );
    }

    if (!sessionSecret) {
      console.error("DREAMZY ADMIN ERROR: ADMIN_SESSION_SECRET is missing.");
      return NextResponse.json(
        { message: "Admin session secret is not configured on the server." },
        { status: 500 }
      );
    }

    if (enteredPassword !== adminPassword) {
      return NextResponse.json(
        { message: "Invalid admin password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: COOKIE_NAME,
      value: makeSession(sessionSecret),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error("DREAMZY ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Admin login server error. Check the terminal." },
      { status: 500 }
    );
  }
}
