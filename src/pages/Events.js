import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../components/EventCard";
import Filters from "../components/Filters";
import Message from "../components/Message";
import { fetchEvents, setPage } from "../features/events/eventsSlice";
import { registerEvent } from "../features/registrations/registrationsSlice";

function Events() {
  const dispatch = useDispatch();

  const { list, loading, error, filters, totalPages, totalEvents } = useSelector(
    (state) => state.events
  );
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector((state) => state.registrations.list);
  const message = useSelector((state) => state.registrations.message);

  //load events on first render and whenever the filters change
  useEffect(() => {
    dispatch(fetchEvents(filters));
    //jump back up or page 2 opens half way down the list
    window.scrollTo(0, 0);
  }, [dispatch, filters]);

  //check if the logged in user already registered for this event
  function isRegistered(eventId) {
    return registrations.some(
      (r) => r.userId === user.id && r.event.id === eventId
    );
  }

  return (
    <div>
      <h1>Events</h1>

      <Filters />
      <Message message={message} />

      {loading && <p>Loading events...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && list.length === 0 && <p>No events found.</p>}

      {!loading && !error && list.length > 0 && (
        <p className="results">{totalEvents} events found</p>
      )}

      <div className="grid">
        {list.map((event) => (
          <EventCard key={event.id} event={event}>
            {/*only logged in users see the register button*/}
            {user &&
              (isRegistered(event.id) ? (
                <button className="btn" disabled>
                  Registered
                </button>
              ) : (
                <button
                  className="btn btn--primary"
                  onClick={() =>
                    dispatch(registerEvent({ userId: user.id, event }))
                  }
                >
                  Register
                </button>
              ))}
          </EventCard>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn"
            disabled={filters.page === 0}
            onClick={() => dispatch(setPage(filters.page - 1))}
          >
            Previous
          </button>

          <span>
            Page {filters.page + 1} of {totalPages}
          </span>

          <button
            className="btn"
            disabled={filters.page >= totalPages - 1}
            onClick={() => dispatch(setPage(filters.page + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Events;
