import { AdminDesk } from "@/components/page-copy/AdminDesk";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-8 sm:px-4 sm:py-14">
      <AdminDesk />
    </div>
  );
}
