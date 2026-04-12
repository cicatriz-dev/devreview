import { useEffect, useState } from "react";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdrs,
  createAdr,
  updateAdr,
  deleteAdr,
  setStatusFilter,
  openModal,
  closeModal,
} from "@/store/slices/adrsSlice";
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
  const {
    items: adrs,
    statusFilter,
    isModalOpen,
    editingAdrId,
  } = useAppSelector((s) => s.adrs);

  const [formTitle, setFormTitle] = useState("");
  const [formContext, setFormContext] = useState("");
  const [formDecision, setFormDecision] = useState("");
  const [formStatus, setFormStatus] = useState<AdrStatus>("proposed");

  useEffect(() => {
    dispatch(fetchAdrs(TEAM_ID));
  }, [dispatch]);

  const editingAdr = editingAdrId
    ? adrs.find((a) => a.id === editingAdrId)
    : null;

  function handleOpenNew() {
    setFormTitle("");
    setFormContext("");
    setFormDecision("");
    setFormStatus("proposed");
    dispatch(openModal(null));
  }

  function handleOpenEdit(id: string) {
    const adr = adrs.find((a) => a.id === id);
    if (adr) {
      setFormTitle(adr.title);
      setFormContext(adr.context);
      setFormDecision(adr.decision);
      setFormStatus(adr.status);
      dispatch(openModal(id));
    }
  }

  async function handleSave() {
    if (!formTitle.trim() || !formContext.trim() || !formDecision.trim()) return;
    if (editingAdrId) {
      await dispatch(
        updateAdr({
          id: editingAdrId,
          title: formTitle.trim(),
          context: formContext.trim(),
          decision: formDecision.trim(),
          status: formStatus,
        })
      );
    } else {
      await dispatch(
        createAdr({
          team_id: TEAM_ID,
          title: formTitle.trim(),
          context: formContext.trim(),
          decision: formDecision.trim(),
          status: formStatus,
        })
      );
    }
    dispatch(closeModal());
  }

  async function handleDelete(id: string) {
    await dispatch(deleteAdr(id));
  }

  const filtered =
    statusFilter === "all"
      ? adrs
      : adrs.filter((a) => a.status === statusFilter);

  const countByStatus = (status: AdrStatus) =>
    adrs.filter((a) => a.status === status).length;

  return (
    <div className="flex flex-col overflow-y-auto">
      <Header
        title="ADRs — Decisões de Arquitetura"
        action={
          <Button
            size="sm"
            className="gap-2 bg-indigo-600 hover:bg-indigo-500"
            onClick={handleOpenNew}
          >
            <Plus className="h-4 w-4" />
            Nova ADR
          </Button>
        }
      />

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
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FileText className="h-3 w-3" />
                    <span className="text-xs">ADR-{adr.id.slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-white"
                      onClick={() => handleOpenEdit(adr.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-red-400"
                      onClick={() => handleDelete(adr.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={() => dispatch(closeModal())}>
        <DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAdr ? "Editar ADR" : "Nova ADR"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="adr-title" className="text-gray-300">
                Título
              </Label>
              <Input
                id="adr-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Adoção de Redux Toolkit para gerenciamento de estado"
                className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adr-context" className="text-gray-300">
                Contexto
              </Label>
              <textarea
                id="adr-context"
                value={formContext}
                onChange={(e) => setFormContext(e.target.value)}
                placeholder="Descreva o contexto e o problema que motivou esta decisão..."
                rows={3}
                className="flex w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adr-decision" className="text-gray-300">
                Decisão
              </Label>
              <textarea
                id="adr-decision"
                value={formDecision}
                onChange={(e) => setFormDecision(e.target.value)}
                placeholder="Descreva a decisão tomada e as justificativas..."
                rows={3}
                className="flex w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-300">Status</Label>
              <Select
                value={formStatus}
                onValueChange={(v) => setFormStatus(v as AdrStatus)}
              >
                <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-900">
                  <SelectItem value="proposed">Proposta</SelectItem>
                  <SelectItem value="accepted">Aceita</SelectItem>
                  <SelectItem value="deprecated">Depreciada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => dispatch(closeModal())}
            >
              Cancelar
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={handleSave}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
