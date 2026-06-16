import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SettingsSidebar } from "./settings-sidebar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = (session.user as any).role;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <SettingsSidebar role={role} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-zinc-950 border border-white/10 rounded-xl p-6 shadow-2xl">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
