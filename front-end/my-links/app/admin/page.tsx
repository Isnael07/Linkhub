import { redirect } from "next/navigation";

// /admin — página dedicada do admin vive em /admin/usuarios
export default function AdminPage() {
    redirect("/admin/usuarios");
}
