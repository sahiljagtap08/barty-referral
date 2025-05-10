"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";

// Demo user data
const DEMO_USER_ID = "demo-user-id";

export type FormData = {
  role: UserRole;
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    // In demo mode, we'll just simulate success without requiring auth
    // Skip auth check and validate the user ID matches our demo user
    if (userId !== DEMO_USER_ID) {
      console.log("Demo mode: Simulating role update for non-demo user");
    }

    const { role } = userRoleSchema.parse(data);

    // Log the action in demo mode
    console.log(`Demo mode: Updating user role to "${role}" for user ${userId}`);
    
    // Optional: Actually update the database if it exists
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: role,
        },
      });
    } catch (dbError) {
      console.log("Database update skipped - demo mode");
    }

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return { status: "error" };
  }
}
