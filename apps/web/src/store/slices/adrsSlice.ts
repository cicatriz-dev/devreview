import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getSupabase } from "@/lib/supabase";
import { Adr, AdrStatus } from "@/types";

export const fetchAdrs = createAsyncThunk(
  "adrs/fetchAdrs",
  async (teamId: string) => {
    const { data, error } = await getSupabase()
      .from("adrs")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Adr[];
  }
);

interface AdrsState {
  items: Adr[];
  fetchError: string | null;
  loading: boolean;
  statusFilter: AdrStatus | "all";
}

const initialState: AdrsState = {
  items: [],
  fetchError: null,
  loading: false,
  statusFilter: "all",
};

const adrsSlice = createSlice({
  name: "adrs",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<AdrStatus | "all">) {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdrs.pending, (state) => {
        state.loading = true;
        state.fetchError = null;
      })
      .addCase(fetchAdrs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.fetchError = null;
      })
      .addCase(fetchAdrs.rejected, (state, action) => {
        state.loading = false;
        state.fetchError =
          action.error.message ?? "Não foi possível carregar as ADRs.";
      });
  },
});

export const { setStatusFilter } = adrsSlice.actions;
export default adrsSlice.reducer;
