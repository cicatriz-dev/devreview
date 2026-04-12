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

export const createAdr = createAsyncThunk(
  "adrs/createAdr",
  async (payload: {
    team_id: string;
    title: string;
    context: string;
    decision: string;
    status: AdrStatus;
  }) => {
    const { data, error } = await getSupabase()
      .from("adrs")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Adr;
  }
);

export const updateAdr = createAsyncThunk(
  "adrs/updateAdr",
  async (payload: {
    id: string;
    title: string;
    context: string;
    decision: string;
    status: AdrStatus;
  }) => {
    const { id, ...fields } = payload;
    const { data, error } = await getSupabase()
      .from("adrs")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Adr;
  }
);

export const deleteAdr = createAsyncThunk(
  "adrs/deleteAdr",
  async (id: string) => {
    const { error } = await getSupabase()
      .from("adrs")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    return id;
  }
);

interface AdrsState {
  items: Adr[];
  fetchError: string | null;
  loading: boolean;
  statusFilter: AdrStatus | "all";
  isModalOpen: boolean;
  editingAdrId: string | null;
}

const initialState: AdrsState = {
  items: [],
  fetchError: null,
  loading: false,
  statusFilter: "all",
  isModalOpen: false,
  editingAdrId: null,
};

const adrsSlice = createSlice({
  name: "adrs",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<AdrStatus | "all">) {
      state.statusFilter = action.payload;
    },
    openModal(state, action: PayloadAction<string | null>) {
      state.isModalOpen = true;
      state.editingAdrId = action.payload;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.editingAdrId = null;
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
      })
      .addCase(createAdr.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAdr.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAdr.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export const { setStatusFilter, openModal, closeModal } = adrsSlice.actions;
export default adrsSlice.reducer;
