import { useEffect } from "react";
import { FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdrs, setStatusFilter } from "@/store/slices/adrsSlice";
import { TEAM_ID } from "@/lib/team";
import { AdrStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  AdrStatus,
  { label: string; className: string }
> = {
  proposed: {
    label: "Proposta",
    className:
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  },
  accepted: {
    label: "Aceita",
    className:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  },
  deprecated: {
    label: "Depreciada",
    className:
      "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const tabItems: { value: AdrStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "proposed", label: "Propostas" },
  { value: "accepted", label: "Aceitas" },
  { value: "deprecated", label: "Depreciadas" },
];

export function AdrsPage() {
  const dispatch = useAppDispatch();
  const { items: adrs, statusFilter } = useAppSelector((s) => s.adrs);

  useEffect(() => {
    dispatch(fetchAdrs(TEAM_ID));
  }, [dispatch]);

  const filtered =
    statusFilter === "all"
      ? adrs
      : adrs.filter((a) => a.status === statusFilter);

  const countByStatus = (status: AdrStatus) =>
    adrs.filter((a) => a.status === status).length;

  return (
    <div className="flex flex-col overflow-y-auto">
      <Header title="ADRs — Decisões de Arquitetura" />

      <div className="flex-1 space-y-5 p-6">
        {/* Tabs filter */}
        <Tabs
          value={statusFilter}
          onValueChange={(v) => dispatch(setStatusFilter(v as AdrStatus | "all"))}
        >
          <TabsList className="bg-gray-900 border border-gray-800">
            {tabItems.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-gray-800 data-[state=active]:text-white text-gray-400"
              >
                {label}
                {value !== "all" && (
                  <span className="ml-1.5 text-xs text-gray-600">
                    ({countByStatus(value as AdrStatus)})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((adr) => {
            const { label, className: statusClass } = statusConfig[adr.status];
            return (
              <div
                key={adr.id}
                className="flex flex-col rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-white">
                    {adr.title}
                  </h3>
                  <span
                    className={cn(
                      "flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusClass
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Date */}
                <p className="mt-1 text-xs text-gray-600">
                  {formatDate(adr.created_at)}
                </p>

                {/* Context */}
                <div className="mt-3 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Contexto
                  </p>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                    {adr.context}
                  </p>
                </div>

                {/* Decision */}
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Decisão
                  </p>
                  <p className="mt-1 text-sm italic text-gray-400 line-clamp-2">
                    {adr.decision}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center gap-1.5 text-gray-600">
                  <FileText className="h-3 w-3" />
                  <span className="text-xs">ADR-{adr.id.slice(0, 3).toUpperCase()}</span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-gray-500">
              Nenhuma ADR encontrada para este filtro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
