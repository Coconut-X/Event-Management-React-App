import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { fetchEventById } from "../features/events/eventsSlice";
import {
  cancelEvent,
  registerEvent,
} from "../features/registrations/registrationsSlice";
import { formatDate } from "../utils/helpers";

function EventDetails() {
  const { id } = useParams(); //comes from the route /events/:id

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selected, loading, error } = useSelector((state) => state.events);
  const user = useSelector((state) => state.auth.user);
  const registrations = useSelector((state) => state.registrations.list);
  const message = useSelector((state) => state.registrations.message);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const registered = registrations.some(
    (r) => user && r.userId === user.id && r.event.id === id
  );

  if (loading) return <p className="note">Loading...</p>;
  if (error) return <p className="note error">{error}</p>;
  if (!selected) return null;

  //the API sends onsale, offsale, cancelled or rescheduled
  const soldOut = selected.status === "offsale" || selected.status === "cancelled";

  function handleClick() {
    //send guests to login first
    if (!user) {
      navigate("/login");
      return;
    }

    if (registered) {
      dispatch(cancelEvent({ userId: user.id, eventId: selected.id }));
    } else {
      dispatch(registerEvent({ userId: user.id, event: selected }));
    }
  }

  return (
    <div>
      <Link to="/events" className="back">
        &larr; Back to events
      </Link>

      <Message message={message} />

      <div className="details">
        {selected.image && (
          <img src={selected.image} alt={selected.name} className="details__img" />
        )}

        <div>
          <span className="badge">{selected.category}</span>
          <h1>{selected.name}</h1>

          <div className="details__row">
            <span className="details__label">Date</span>
            <span>{formatDate(selected.date)}</span>
          </div>

          <div className="details__row">
            <span className="details__label">Venue</span>
            <span>{selected.venue}</span>
          </div>

          <div className="details__row">
            <span className="details__label">Location</span>
            <span>
              {selected.city}
              {selected.country && `, ${selected.country}`}
            </span>
          </div>

          {selected.genre && (
            <div className="details__row">
              <span className="details__label">Type</span>
              <span>{selected.genre}</span>
            </div>
          )}

          {selected.price && (
            <div className="details__row">
              <span className="details__label">Tickets</span>
              <span>{selected.price}</span>
            </div>
          )}

          <div className="details__actions">
            <button
              className={registered ? "btn btn--danger" : "btn btn--primary"}
              onClick={handleClick}
              disabled={soldOut && !registered}
            >
              {!user
                ? "Login to register"
                : registered
                ? "Cancel registration"
                : soldOut
                ? "Sold out"
                : "Register"}
            </button>

            {selected.url && (
              <a href={selected.url} target="_blank" rel="noreferrer">
                View on Ticketmaster
              </a>
            )}
          </div>
        </div>
      </div>

      {selected.info && (
        <div className="about">
          <h2>About this event</h2>
          <p>{selected.info}</p>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
