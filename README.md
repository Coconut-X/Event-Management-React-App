# Event Management System

Web Programming - Assignment 2

A React app where you can browse events, see their details, register for them
and manage your registrations. Event data comes from the Ticketmaster
Discovery API.

Built with React, Redux Toolkit and React Router.

## Features

- Register / login / logout (saved in localStorage so you stay logged in after refresh)
- Browse events with search, city, category and date filters
- Pagination
- Event details page
- Register for an event (duplicates are blocked)
- My Events page split into Upcoming and Completed
- Cancel a registration, with a confirm box first
- My Events is a protected route, guests get sent to login
- Ticket price, genre and sold out status pulled from the API
- Count badge on the My Events link and a total results count
- Success and error messages that hide themselves after a few seconds

## How to run

1. Install the packages:

```
npm install
```

2. Get a free API key from https://developer.ticketmaster.com/ (it is called
   the "Consumer Key").

3. Make a `.env` file in the project folder and put your key in it:

```
REACT_APP_TM_API_KEY=your_key_here
```

You can copy `.env.example` to get started. The `.env` file is in `.gitignore`
so the key is not pushed to GitHub.

4. Start the app:

```
npm start
```

It runs on http://localhost:3000

## Folder structure

```
src/
  api/ticketmaster.js      - all API calls
  app/store.js             - the Redux store
  features/
    auth/authSlice.js            - login, register, logout
    events/eventsSlice.js        - events list, selected event, filters
    registrations/...Slice.js    - who registered for what
  components/
    Navbar.js
    ProtectedRoute.js
    EventCard.js
    Filters.js
    Message.js
  pages/
    Login.js, Register.js, Events.js, EventDetails.js, MyEvents.js, NotFound.js
  utils/helpers.js         - date formatting
  App.js                   - routes
  index.js                 - Provider + BrowserRouter
```

## Routes

| Route         | Page          |
| ------------- | ------------- |
| /             | redirects to /events |
| /login        | Login         |
| /register     | Register      |
| /events       | Events list   |
| /events/:id   | Event details |
| /my-events    | My Events (login needed) |

## Redux store

```
auth          -> user, users, error
events        -> list, selected, loading, error, filters, totalPages, totalEvents
registrations -> list, message
```

The API calls are done with `createAsyncThunk` so the loading and error states
come from the pending / fulfilled / rejected cases.

## Note

Login is only simulated on the frontend, there is no backend. Users are kept in
localStorage, which also means passwords are stored as plain text. That is fine
for this assignment but would not be okay in a real app.
