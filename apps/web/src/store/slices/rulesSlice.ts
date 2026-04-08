import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSupabase } from "@/lib/supabase";
import { ReviewRule, RuleCategory, RuleSeverity } from "@/types";

export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async (teamId: string) => {
    const { data, error } = await getSupabase()
      .from("review_rules")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as ReviewRule[];
  }
);

interface RulesState {
  items: ReviewRule[];
  fetchError: string | null;
  loading: boolean;
  categoryFilter: RuleCategory | "all";
  severityFilter: RuleSeverity | "all";
  isModalOpen: boolean;
  editingRuleId: string | null;
}

const initialState: RulesState = {
  items: [],
  fetchError: null,
  loading: false,
  categoryFilter: "all",
  severityFilter: "all",
  isModalOpen: false,
  editingRuleId: null,
};

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    setCategoryFilter(state, action: PayloadAction<RuleCategory | "all">) {
      state.categoryFilter = action.payload;
    },
    setSeverityFilter(state, action: PayloadAction<RuleSeverity | "all">) {
      state.severityFilter = action.payload;
    },
    openModal(state, action: PayloadAction<string | null>) {
      state.isModalOpen = true;
      state.editingRuleId = action.payload;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.editingRuleId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.fetchError = null;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.fetchError = null;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.fetchError =
          action.error.message ?? "Não foi possível carregar as regras.";
      });
  },
});

export const { setCategoryFilter, setSeverityFilter, openModal, closeModal } =
  rulesSlice.actions;
export default rulesSlice.reducer;
