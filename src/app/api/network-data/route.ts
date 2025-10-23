import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://217.170.194.44:3341/network-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching network data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch network data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
