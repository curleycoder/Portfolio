import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Contact Me</h1>
        <ContactForm />
      </div>
    </main>
  );
}
