import { createSlice } from "@reduxjs/toolkit";

//fake login with no backend
//users are kept in localStorage so the passwords are plain text
//that is fine for this assignment but never ok in a real app

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

      //do not allow the same email twice
      const taken = state.users.find((u) => u.email === email);
      if (taken) {
        state.error = "This email is already registered";
        return;
      }

      const newUser = { id: Date.now(), name, email, password };
      state.users.push(newUser);

      //log them in right away
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

      //keep the password out of the logged in user
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
