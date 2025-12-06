"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SigninForm } from "@/components/SigninForm";

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Entrar</CardTitle>
        </CardHeader>

        <CardContent>
          <SigninForm />
        </CardContent>
      </Card>
    </div>
  );
}
