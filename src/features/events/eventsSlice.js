import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getEvent, searchEvents } from "../../api/ticketmaster";

// createAsyncThunk gives us pending/fulfilled/rejected for free
export const fetchEvents = createAsyncThunk("events/fetchEvents", (filters) =>
  searchEvents(filters)
);

export const fetchEventById = createAsyncThunk("events/fetchEventById", (id) =>
  getEvent(id)
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
    totalPages: 0,
    filters: {
      keyword: "",
      city: "",
      category: "",
      date: "",
      page: 0,
    },
  },
  reducers: {
    setFilters(state, action) {
      // action.payload is like { keyword: "rock", city: "Lahore" }
      state.filters = { ...state.filters, ...action.payload, page: 0 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.events;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selected = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, setPage } = eventsSlice.actions;
export default eventsSlice.reducer;
