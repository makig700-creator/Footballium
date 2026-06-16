"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/settings/admin/logs?page=${page}&limit=50`)
      .then(res => res.json())
      .then(data => {
        setLogs(data.logs || []);
        setMeta(data.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Логи Активності
      </h1>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#CCFF00]" /></div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Час</th>
                  <th className="px-4 py-3">Користувач</th>
                  <th className="px-4 py-3">Дія</th>
                  <th className="px-4 py-3">Об'єкт</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((logRaw: any) => {
                  let parsedMeta = logRaw.metadata;
                  if (typeof parsedMeta === 'string') {
                    try { parsedMeta = JSON.parse(parsedMeta); } catch (e) {}
                  }
                  const log = { ...logRaw, metadata: parsedMeta };

                  const translateAction = (action: string) => {
                    const map: Record<string, string> = {
                      'USER_ROLE_CHANGED': 'Зміна ролі',
                      'USER_BLOCKED': 'Блокування користувача',
                      'USER_UNBLOCKED': 'Розблокування користувача',
                      'USER_NAME_CHANGED': 'Зміна імені',
                      'TOURNAMENT_CREATED': 'Створення турніру',
                      'TOURNAMENT_UPDATED': 'Оновлення турніру',
                      'TOURNAMENT_DELETED': 'Видалення турніру',
                      'MATCH_STARTED': 'Початок матчу',
                      'MATCH_FINISHED': 'Завершення матчу',
                      'REFEREE_ASSIGNED': 'Призначення судді',
                      'APPLICATION_APPROVED': 'Схвалення заявки',
                      'APPLICATION_REJECTED': 'Відхилення заявки',
                    };
                    return map[action] || action;
                  };

                  const translateEntity = (entity: string) => {
                    const map: Record<string, string> = {
                      'User': 'Користувач',
                      'Tournament': 'Турнір',
                      'Match': 'Матч',
                      'Team': 'Команда',
                      'Application': 'Заявка',
                    };
                    return map[entity] || entity;
                  };

                  return (
                    <tr key={log.id} className="border-b border-white/5 bg-zinc-950 hover:bg-zinc-900/50">
                      <td className="px-4 py-3 whitespace-nowrap text-zinc-400">
                        {new Date(log.createdAt).toLocaleString("uk-UA")}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {log.user?.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-zinc-800 text-[#CCFF00]">
                          {translateAction(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        <div className="font-bold text-white mb-1">
                          {translateEntity(log.entity)}
                          {log.metadata?.targetName && ` (${log.metadata.targetName})`}
                        </div>
                        {log.action === "USER_NAME_CHANGED" && log.metadata && (
                          <div className="text-xs text-zinc-500">
                            Змінено з "{log.metadata.oldName}" на "{log.metadata.newName}"
                          </div>
                        )}
                        {log.action === "USER_ROLE_CHANGED" && log.metadata && (
                          <div className="text-xs text-zinc-500">
                            Нова роль: {log.metadata.newRole} (Була: {log.metadata.oldRole})
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-600 mt-1">ID: {log.entityId}</div>
                      </td>
                    </tr>
                  );
                })}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Немає записів</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="bg-transparent border-white/10"
              >
                Попередня
              </Button>
              <span className="flex items-center px-4 text-sm">Сторінка {page} з {meta.totalPages}</span>
              <Button 
                variant="outline" 
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="bg-transparent border-white/10"
              >
                Наступна
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
