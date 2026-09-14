import { NextResponse } from "next/server";
import { fetchGitHub } from "@/lib/github";

export const revalidate = 3600;

/**
 * Server-side proxy for GitHub data.
 * - Caches for an hour (protects the unauthenticated 60 req/h limit).
 * - Never leaks a token to the client.
 * - On failure returns 503 with a machine-readable error; the client falls
 *   back to a dated snapshot of real repositories.
 */
export async function GET() {
  try {
    const data = await fetchGitHub();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "github_unavailable", message: err instanceof Error ? err.message : "Unknown error" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
