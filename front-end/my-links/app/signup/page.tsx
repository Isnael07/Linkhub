"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SignupForm } from "@/components/signupForma";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Criar Conta</CardTitle>
        </CardHeader>

        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
