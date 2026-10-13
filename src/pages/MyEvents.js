import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/EventCard";
import Message from "../components/Message";
import { cancelEvent } from "../features/registrations/registrationsSlice";
import { isPast } from "../utils/helpers";

function MyEvents() {
  const [tab, setTab] = useState("upcoming");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector((state) => state.registrations.list);
  const message = useSelector((state) => state.registrations.message);

  // only this user's registrations
  const mine = registrations.filter((r) => r.userId === user.id);

  const upcoming = mine.filter((r) => !isPast(r.event.date));
  const completed = mine.filter((r) => isPast(r.event.date));

  const shown = tab === "upcoming" ? upcoming : completed;

  return (
    <div>
      <h1>My Events</h1>

      <Message message={message} />

      <div className="tabs">
        <button
          className={tab === "upcoming" ? "tabs__tab active" : "tabs__tab"}
          onClick={() => setTab("upcoming")}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          className={tab === "completed" ? "tabs__tab active" : "tabs__tab"}
          onClick={() => setTab("completed")}
        >
          Completed ({completed.length})
        </button>
      </div>

      {shown.length === 0 && <p>No events here yet.</p>}

      <div className="grid">
        {shown.map((r) => (
          <EventCard key={r.event.id} event={r.event}>
            {/* no point cancelling an event that already happened */}
            {tab === "upcoming" && (
              <button
                className="btn btn--danger"
                onClick={() =>
                  dispatch(
                    cancelEvent({ userId: user.id, eventId: r.event.id })
                  )
                }
              >
                Cancel
              </button>
            )}
          </EventCard>
        ))}
      </div>
    </div>
  );
}

export default MyEvents;
