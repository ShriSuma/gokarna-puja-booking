"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { useI18n } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

type Form = z.infer<typeof schema>;

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const form = useForm<Form>({ resolver: zodResolver(schema) });
  const { t } = useI18n();

  async function onSubmit(values: Form) {
    setSending(true);
    try {
      const res = await submitContactForm(values);
      if (res.ok) toast.success(t("contactToast.sent"));
      else toast.message(t("contactToast.devLog"));
      form.reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("contactToast.sendFail"));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 font-body text-lg md:max-w-xl">
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="c-name">
          {t("contact.name")}
        </label>
        <input id="c-name" className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" {...form.register("name")} />
        {form.formState.errors.name && (
          <p className="text-sm text-red-700">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="c-email">
          {t("contact.email")}
        </label>
        <input
          id="c-email"
          type="email"
          className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-700">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="c-msg">
          {t("contact.message")}
        </label>
        <textarea id="c-msg" rows={4} className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" {...form.register("message")} />
        {form.formState.errors.message && (
          <p className="text-sm text-red-700">{form.formState.errors.message.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn-shine rounded-md bg-maroon px-5 py-2 font-semibold text-parchment disabled:opacity-50"
      >
        {sending ? "Sending…" : t("contact.sendNote")}
      </button>
    </form>
  );
}
