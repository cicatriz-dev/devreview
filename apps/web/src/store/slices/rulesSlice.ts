import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { ReviewRule, RuleCategory, RuleSeverity } from "@/types";

export const fetchRules = createAsyncThunk(
  "rules/fetchRules",
  async (teamId: string) => {
    const { data, error } = await supabase
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
  loading: boolean;
  categoryFilter: RuleCategory | "all";
  severityFilter: RuleSeverity | "all";
  isModalOpen: boolean;
  editingRuleId: string | null;
}

const initialState: RulesState = {
  items: [],
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
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchRules.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCategoryFilter, setSeverityFilter, openModal, closeModal } =
  rulesSlice.actions;
export default rulesSlice.reducer;
