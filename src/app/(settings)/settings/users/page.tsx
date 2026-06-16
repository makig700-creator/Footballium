"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UserX, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/settings/admin/users", window.location.origin);
      if (roleFilter !== "ALL") url.searchParams.set("role", roleFilter);
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("Помилка завантаження");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const updateRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/settings/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success("Роль змінено");
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      } else {
        const err = await res.text();
        toast.error(err);
      }
    } catch {
      toast.error("Помилка мережі");
    }
  };

  const updateName = async (id: string, newName: string) => {
    if (!newName.trim()) {
      toast.error("Ім'я не може бути порожнім");
      return;
    }
    try {
      const res = await fetch(`/api/settings/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        toast.success("Ім'я змінено");
        setUsers(users.map(u => u.id === id ? { ...u, name: newName } : u));
      } else {
        const err = await res.text();
        toast.error(err);
      }
    } catch {
      toast.error("Помилка мережі");
    }
  };

  const toggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`/api/settings/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !isBlocked }),
      });
      if (res.ok) {
        toast.success(isBlocked ? "Користувача розблоковано" : "Користувача заблоковано");
        setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !isBlocked } : u));
      } else {
        const err = await res.text();
        toast.error(err);
      }
    } catch {
      toast.error("Помилка мережі");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-widest">Користувачі</h1>
        <Select value={roleFilter} onValueChange={(val) => val && setRoleFilter(val)}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-white/10">
            <SelectValue placeholder="Всі ролі">
              {roleFilter === "ALL" ? "Всі ролі" : 
               roleFilter === "USER" ? "Вболівальник" : 
               roleFilter === "COACH" ? "Тренер" : 
               roleFilter === "REFEREE" ? "Суддя" : "Адміністратор"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10">
            <SelectItem value="ALL">Всі ролі</SelectItem>
            <SelectItem value="USER">Вболівальник</SelectItem>
            <SelectItem value="COACH">Тренер</SelectItem>
            <SelectItem value="REFEREE">Суддя</SelectItem>
            <SelectItem value="ADMIN">Адміністратор</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Користувач</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Роль</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-white/5 bg-zinc-950 hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                    <img 
                      src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover shrink-0" 
                    />
                    <Input 
                      defaultValue={user.name} 
                      onBlur={(e) => {
                        if (e.target.value !== user.name) {
                          updateName(user.id, e.target.value);
                        }
                      }}
                      className="bg-transparent border-transparent hover:border-white/10 focus-visible:ring-[#CCFF00] h-8 text-sm px-2 w-[200px]"
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{user.phone || "—"}</td>
                  <td className="px-4 py-3 text-zinc-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <Select value={user.role} onValueChange={(val) => updateRole(user.id, val)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-900 border-white/10">
                        <SelectValue>
                          {user.role === "USER" ? "Вболівальник" : 
                           user.role === "COACH" ? "Тренер" : 
                           user.role === "REFEREE" ? "Суддя" : "Адміністратор"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="USER">Вболівальник</SelectItem>
                        <SelectItem value="COACH">Тренер</SelectItem>
                        <SelectItem value="REFEREE">Суддя</SelectItem>
                        <SelectItem value="ADMIN">Адміністратор</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
