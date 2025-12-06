"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreateLinkForm } from "@/components/CreateLinkForm";

export default function CreateLinkPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Cadastrar Link</CardTitle>
        </CardHeader>

        <CardContent>
          <CreateLinkForm />
        </CardContent>
      </Card>
    </div>
  );
}
