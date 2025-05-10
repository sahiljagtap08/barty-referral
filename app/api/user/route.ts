import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Demo user ID for testing without auth
const DEMO_USER_ID = "demo-user-id";

export async function DELETE(req: NextRequest) {
  try {
    // In demo mode, we just log the action without actually deleting
    console.log(`Demo mode: Simulating user deletion for user ${DEMO_USER_ID}`);
    
    // Optionally, if you want to attempt the actual deletion:
    try {
      await prisma.user.delete({
        where: {
          id: DEMO_USER_ID,
        },
      });
    } catch (dbError) {
      console.log("Database deletion skipped - demo mode or user doesn't exist");
    }

    return new NextResponse("User deleted successfully!", { status: 200 });
  } catch (error) {
    console.error("Error in user DELETE API:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
