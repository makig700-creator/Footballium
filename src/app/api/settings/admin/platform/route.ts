import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "platform-settings.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      siteName: "Footballium",
      logo: null,
      primaryColor: "#CCFF00",
      accentColor: "#000000"
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    let currentData = {
      siteName: "Footballium",
      logo: null,
      primaryColor: "#CCFF00",
      accentColor: "#000000"
    };

    try {
      const fileData = await fs.readFile(DATA_FILE, "utf-8");
      currentData = { ...currentData, ...JSON.parse(fileData) };
    } catch (e) {
      // Ignore if file doesn't exist
    }

    const updatedData = { ...currentData, ...body };
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), "utf-8");

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
