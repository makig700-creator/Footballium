import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { GET } from "@/app/api/admin/dashboard/route"

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // Fetch initial data using the API route handler directly
  const response = await GET()
  if (response.status !== 200) {
    return <div className="text-white text-center py-20 font-bold uppercase tracking-widest">Помилка завантаження даних</div>
  }
  
  const data = await response.json()

  return (
    <DashboardClient initialData={data} />
  )
}
