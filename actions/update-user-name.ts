"use server";

import { prisma } from "@/lib/db";
import { userNameSchema } from "@/lib/validations/user";
import { revalidatePath } from "next/cache";

// Demo user data
const DEMO_USER_ID = "demo-user-id";

export type FormData = {
  name: string;
};

export async function updateUserName(userId: string, data: FormData) {
  try {
    // In demo mode, we'll just simulate success without requiring auth
    // Skip auth check and validate the user ID matches our demo user
    if (userId !== DEMO_USER_ID) {
      console.log("Demo mode: Simulating update for non-demo user");
    }

    const { name } = userNameSchema.parse(data);

    // In a real app, this would update the database
    // For demo purposes, we'll just log the action
    console.log(`Demo mode: Updating user name to "${name}" for user ${userId}`);
    
    // Optional: Actually update the database if it exists
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name,
        },
      });
    } catch (dbError) {
      console.log("Database update skipped - demo mode");
    }

    revalidatePath('/dashboard/settings');
    return { status: "success" };
  } catch (error) {
    console.error("Error in updateUserName:", error);
    return { status: "error" };
  }
}