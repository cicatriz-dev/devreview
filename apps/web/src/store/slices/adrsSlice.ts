import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabase";
import { Adr, AdrStatus } from "@/types";

export const fetchAdrs = createAsyncThunk(
  "adrs/fetchAdrs",
  async (teamId: string) => {
    const { data, error } = await supabase
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
  loading: boolean;
  statusFilter: AdrStatus | "all";
}

const initialState: AdrsState = {
  items: [],
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
      })
      .addCase(fetchAdrs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdrs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setStatusFilter } = adrsSlice.actions;
export default adrsSlice.reducer;
