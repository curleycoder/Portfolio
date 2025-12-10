"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/app/contact/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
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

  return (
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
              <FormLabel className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  className="h-10 rounded-lg border-neutral-700 bg-neutral-900/60 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                  {...field}
                />
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
              <FormLabel className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  className="h-10 rounded-lg border-neutral-700 bg-neutral-900/60 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-blue-500"
                  {...field}
                />
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
              <FormLabel className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                Message
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={5}
                  placeholder="Write your message..."
                  className="flex min-h-[120px] w-full rounded-lg border border-neutral-700 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="mt-2 w-full rounded-lg border border-blue-500/80 bg-blue-500/80 text-sm font-medium hover:bg-blue-400"
        >
          Send message
        </Button>
      </form>
    </Form>
  );
}
