import { createSlice } from "@reduxjs/toolkit";

//every registration keeps the userId so users do not see each others events
//we also save a copy of the event so My Events does not call the API again

function getSaved() {
  const data = localStorage.getItem("registrations");
  return data ? JSON.parse(data) : [];
}

const registrationsSlice = createSlice({
  name: "registrations",
  initialState: {
    list: getSaved(),
    message: null, //shown after registering or cancelling
  },
  reducers: {
    registerEvent(state, action) {
      const { userId, event } = action.payload;

      //stop duplicate registration
      const already = state.list.find(
        (r) => r.userId === userId && r.event.id === event.id
      );
      if (already) {
        state.message = { type: "error", text: "You already registered for this event" };
        return;
      }

      state.list.push({ userId, event });
      state.message = { type: "success", text: "Registered successfully!" };
      localStorage.setItem("registrations", JSON.stringify(state.list));
    },

    cancelEvent(state, action) {
      const { userId, eventId } = action.payload;

      state.list = state.list.filter(
        (r) => !(r.userId === userId && r.event.id === eventId)
      );

      state.message = { type: "success", text: "Registration cancelled" };
      localStorage.setItem("registrations", JSON.stringify(state.list));
    },

    clearMessage(state) {
      state.message = null;
    },
  },
});

export const { registerEvent, cancelEvent, clearMessage } =
  registrationsSlice.actions;
export default registrationsSlice.reducer;
