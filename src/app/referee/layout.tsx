import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { auth } from '@/lib/auth'

export default async function RefereeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'REFEREE') {
    redirect('/')
  }

  return (
    <div className="flex flex-col h-screen bg-[#000000] overflow-hidden">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
