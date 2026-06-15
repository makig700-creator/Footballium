import { Navbar } from '@/components/layout/Navbar'
import { SidebarNav } from '@/components/dashboard/SidebarNav'

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-[#000000] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
