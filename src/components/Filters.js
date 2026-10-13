import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "../features/events/eventsSlice";

// The main categories (segments) from the Ticketmaster API
const CATEGORIES = ["Music", "Sports", "Arts & Theatre", "Film", "Miscellaneous"];

function Filters() {
  // kept in local state while typing, only sent to Redux on submit
  const [form, setForm] = useState({
    keyword: "",
    city: "",
    category: "",
    date: "",
  });

  const dispatch = useDispatch();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();
    dispatch(setFilters(form));
  }

  function handleClear() {
    const empty = { keyword: "", city: "", category: "", date: "" };
    setForm(empty);
    dispatch(setFilters(empty));
  }

  return (
    <form className="filters" onSubmit={handleSearch}>
      <input
        type="text"
        name="keyword"
        placeholder="Search events"
        value={form.keyword}
        onChange={handleChange}
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
      />

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button type="submit" className="btn btn--primary">
        Search
      </button>

      <button type="button" className="btn" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
}

export default Filters;
