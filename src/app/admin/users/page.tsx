import { prisma } from "@/lib/prisma"
import { Users, Shield, ShieldCheck, User as UserIcon } from "lucide-react"

export const revalidate = 0 // Admins should see up-to-date data

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      team: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Користувачі</h1>
      </div>

      <div className="bg-[#0a0a0a] border border-gray-900 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
            <thead className="bg-[#111] text-xs uppercase font-bold tracking-widest text-gray-500 border-b border-gray-900">
              <tr>
                <th className="px-6 py-4">Ім'я</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">Команда</th>
                <th className="px-6 py-4">Дата реєстрації</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900/50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[#ccff00] shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border ${
                      user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      user.role === 'COACH' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                      'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
                      {user.role === 'COACH' && <Shield className="w-3 h-3" />}
                      {user.role === 'USER' && <UserIcon className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
                    {user.team ? <span className="text-[#ccff00]">{user.team.name}</span> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-800 mx-auto mb-3" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">Користувачів не знайдено</p>
          </div>
        )}
      </div>
    </div>
  )
}
