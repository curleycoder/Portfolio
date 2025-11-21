import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function NotFound({ message }) {
  const displayMessage =
    message ??
    "The page you are looking for doesn’t exist or might have been moved.";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Page not found
          </CardTitle>
          <CardDescription>{displayMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
