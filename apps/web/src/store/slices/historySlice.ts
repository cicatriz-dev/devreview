import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSupabase } from "@/lib/supabase";
import { ReviewHistory } from "@/types";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (teamId: string) => {
    const { data, error } = await getSupabase()
      .from("review_history")
      .select("*")
      .eq("team_id", teamId)
      .order("reviewed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as ReviewHistory[];
  }
);

interface HistoryState {
  items: ReviewHistory[];
  fetchError: string | null;
  loading: boolean;
  repoFilter: string;
}

const initialState: HistoryState = {
  items: [],
  fetchError: null,
  loading: false,
  repoFilter: "",
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setRepoFilter(state, action: PayloadAction<string>) {
      state.repoFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.fetchError = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.fetchError = null;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.fetchError =
          action.error.message ?? "Não foi possível carregar o histórico.";
      });
  },
});

export const { setRepoFilter } = historySlice.actions;
export default historySlice.reducer;
