import { createSlice } from "@reduxjs/toolkit";

// Fake login, no backend. Users are just kept in localStorage.
// (Storing passwords like this is obviously not safe, but the
// assignment says a real backend is not needed.)

function getSaved(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getSaved("user"),
    users: getSaved("users") || [],
    error: null,
  },
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload;

      // don't allow the same email twice
      const taken = state.users.find((u) => u.email === email);
      if (taken) {
        state.error = "This email is already registered";
        return;
      }

      const newUser = { id: Date.now(), name, email, password };
      state.users.push(newUser);

      // log them in right away
      state.user = { id: newUser.id, name, email };
      state.error = null;

      localStorage.setItem("users", JSON.stringify(state.users));
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    login(state, action) {
      const { email, password } = action.payload;

      const found = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) {
        state.error = "Wrong email or password";
        return;
      }

      // keep the password out of the logged in user
      state.user = { id: found.id, name: found.name, email: found.email };
      state.error = null;
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
  },
});

export const { register, login, logout } = authSlice.actions;
export default authSlice.reducer;
