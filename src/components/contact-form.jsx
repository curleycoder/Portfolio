"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/app/contact/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data) => {
    const t = toast.loading("Sending...");

    try {
      const res = await fetch("/api/contact-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        toast.error(result.message || "Failed to send message.");
        toast.dismiss(t);
        return;
      }

      toast.success("Message sent!");
      toast.dismiss(t);
      form.reset();
    } catch (err) {
      console.error("Contact error:", err);
      toast.error("Unexpected error. Please try again.");
      toast.dismiss(t);
    }
  };

  const labelCls =
    "text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground";

  const inputCls =
    "h-10 rounded-xl border border-input bg-background/40 text-sm text-foreground " +
    "placeholder:text-muted-foreground/70 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const textareaCls =
    "flex min-h-[120px] w-full rounded-xl border border-input bg-background/40 px-3 py-2 text-sm text-foreground " +
    "placeholder:text-muted-foreground/70 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:cursor-not-allowed disabled:opacity-50";

return (
  <div className="mx-auto w-full max-w-lg">
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" className={inputCls} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* EMAIL */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" className={inputCls} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* MESSAGE */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelCls}>Message</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Write your message..." {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-xl bg-primary text-primary-foreground hover:opacity-90 border border-border no-underline"
        >
          Send message
        </Button>
      </form>
    </Form>
  </div>
);
}