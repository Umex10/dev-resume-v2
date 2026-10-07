import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
import EmailTemplate from "../components/ui/email-template";
import { formSchema } from "@/lib/formSchema";
import z from "zod";
export async function sendEmail(data: z.infer<typeof formSchema>) {
  const { fullName, email, message } = data;

  try {

    const { data: response, error } = await resend.emails.send({
      from: "Umejr's Dev Resume <onboarding@resend.dev>",
      to: ["umi.dzinovic10@gmail.com"],
      subject: `New message from ${fullName}`,
      react: EmailTemplate({fullName, email, message})
    });

    if (error) {
      console.error("Resend Error:", error);
      return { error };
    }

    return { success: true, data: response };
  } catch (err) {
    console.error("Server Exception:", err);
    return { error: "Unexpected server error." };
  }
}
