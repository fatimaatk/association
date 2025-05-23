import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse(
    `User-agent: *
Disallow: /`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}