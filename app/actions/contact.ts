"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(raw: unknown) {
  const data = schema.parse(raw);
  return sendContactEmail(data);
}
