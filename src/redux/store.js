import { configureStore } from "@reduxjs/toolkit";
import ticketsReducer from "./ticketSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    tickets: ticketsReducer,
    user: userReducer,

  },
});

export default store;
