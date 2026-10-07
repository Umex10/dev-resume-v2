"use server";

import { z } from "zod";
import { formSchema } from "@/lib/formSchema";
import { sendEmail } from "@/lib/email";

export async function send(formData: z.infer<typeof formSchema>) {
  const result = await sendEmail(formData);

  if (result.error) {
    return { error: result.error };
  }

  return { success: true };
}
