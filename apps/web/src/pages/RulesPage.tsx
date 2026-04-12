import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRules,
  createRule,
  updateRule,
  deleteRule,
  setCategoryFilter,
  setSeverityFilter,
  openModal,
  closeModal,
} from "@/store/slices/rulesSlice";
import { TEAM_ID } from "@/lib/team";
import { RuleCategory, RuleSeverity } from "@/types";

export function RulesPage() {
  const dispatch = useAppDispatch();
  const { items: rules, categoryFilter, severityFilter, isModalOpen, editingRuleId } =
    useAppSelector((s) => s.rules);

  const [formRule, setFormRule] = useState("");
  const [formCategory, setFormCategory] = useState<RuleCategory>("style");
  const [formSeverity, setFormSeverity] = useState<RuleSeverity>("warning");
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    dispatch(fetchRules(TEAM_ID));
  }, [dispatch]);

  const editingRule = editingRuleId
    ? rules.find((r) => r.id === editingRuleId)
    : null;

  function handleOpenNew() {
    setFormRule("");
    setFormCategory("style");
    setFormSeverity("warning");
    setFormActive(true);
    dispatch(openModal(null));
  }

  function handleOpenEdit(id: string) {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setFormRule(rule.rule);
      setFormCategory(rule.category);
      setFormSeverity(rule.severity);
      setFormActive(rule.active);
      dispatch(openModal(id));
    }
  }

  async function handleSave() {
    if (!formRule.trim()) return;
    if (editingRuleId) {
      await dispatch(
        updateRule({
          id: editingRuleId,
          rule: formRule.trim(),
          category: formCategory,
          severity: formSeverity,
          active: formActive,
        })
      );
    } else {
      await dispatch(
        createRule({
          team_id: TEAM_ID,
          rule: formRule.trim(),
          category: formCategory,
          severity: formSeverity,
        })
      );
    }
    dispatch(closeModal());
  }

  async function handleDelete(id: string) {
    await dispatch(deleteRule(id));
  }

  const filtered = rules.filter((rule) => {
    const matchCategory =
      categoryFilter === "all" || rule.category === categoryFilter;
    const matchSeverity =
      severityFilter === "all" || rule.severity === severityFilter;
    return matchCategory && matchSeverity;
  });

  return (
    <div className="flex flex-col overflow-y-auto">
      <Header
        title="Regras de Review"
        action={
          <Button
            size="sm"
            className="gap-2 bg-indigo-600 hover:bg-indigo-500"
            onClick={handleOpenNew}
          >
            <Plus className="h-4 w-4" />
            Nova Regra
          </Button>
        }
      />

      <div className="flex-1 space-y-4 p-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select
            value={categoryFilter}
            onValueChange={(v) =>
              dispatch(setCategoryFilter(v as RuleCategory | "all"))
            }
          >
            <SelectTrigger className="w-44 border-gray-700 bg-gray-900 text-sm">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-900">
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="style">Estilo</SelectItem>
              <SelectItem value="architecture">Arquitetura</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(v) =>
              dispatch(setSeverityFilter(v as RuleSeverity | "all"))
            }
          >
            <SelectTrigger className="w-40 border-gray-700 bg-gray-900 text-sm">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-900">
              <SelectItem value="all">Todas severidades</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto text-xs text-gray-500">
            {filtered.length} regra{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-800 bg-gray-900">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Regra</TableHead>
                <TableHead className="w-36 text-gray-400">Categoria</TableHead>
                <TableHead className="w-28 text-gray-400">Severidade</TableHead>
                <TableHead className="w-24 text-gray-400">Status</TableHead>
                <TableHead className="w-16 text-gray-400" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rule) => (
                <TableRow
                  key={rule.id}
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  <TableCell className="text-sm text-white">
                    {rule.rule}
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={rule.category} />
                  </TableCell>
                  <TableCell>
                    <SeverityBadge severity={rule.severity} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        rule.active
                          ? "inline-flex items-center rounded-full border border-green-500/30 bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400"
                          : "inline-flex items-center rounded-full border border-gray-600/30 bg-gray-600/20 px-2.5 py-0.5 text-xs font-medium text-gray-400"
                      }
                    >
                      {rule.active ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-white"
                        onClick={() => handleOpenEdit(rule.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-400"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow className="border-gray-800">
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-gray-500"
                  >
                    Nenhuma regra encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={() => dispatch(closeModal())}>
        <DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Editar Regra" : "Nova Regra"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="rule-text" className="text-gray-300">
                Descrição da regra
              </Label>
              <Input
                id="rule-text"
                value={formRule}
                onChange={(e) => setFormRule(e.target.value)}
                placeholder="Ex: Nunca expor tokens em código-fonte"
                className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-300">Categoria</Label>
                <Select
                  value={formCategory}
                  onValueChange={(v) => setFormCategory(v as RuleCategory)}
                >
                  <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-900">
                    <SelectItem value="style">Estilo</SelectItem>
                    <SelectItem value="architecture">Arquitetura</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300">Severidade</Label>
                <Select
                  value={formSeverity}
                  onValueChange={(v) => setFormSeverity(v as RuleSeverity)}
                >
                  <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-900">
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="warning">Aviso</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editingRuleId && (
              <div className="flex items-center justify-between">
                <Label htmlFor="rule-active" className="text-gray-300">
                  Regra ativa
                </Label>
                <Switch
                  id="rule-active"
                  checked={formActive}
                  onCheckedChange={setFormActive}
                />
              </div>
            )}
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
