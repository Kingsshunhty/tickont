import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase.config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Async thunk to fetch tickets from Firestore
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, thunkAPI) => {
    try {
      const snapshot = await getDocs(collection(db, "tickets"));
      const tickets = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      return tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a ticket from Firestore
export const deleteTicket = createAsyncThunk(
  "tickets/deleteTicket",
  async (ticketId, thunkAPI) => {
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
      return ticketId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTickets(state, action) {
      state.tickets = action.payload;
    },
    // You can add additional reducers here if needed.
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Ticket
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.filter(
          (ticket) => ticket.id !== action.payload
        );
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { setTickets } = ticketsSlice.actions;
export default ticketsSlice.reducer;
