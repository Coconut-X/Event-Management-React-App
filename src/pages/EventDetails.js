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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
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
      <Link to="/events">&larr; Back to events</Link>

      <Message message={message} />

      <div className="details">
        {selected.image && (
          <img src={selected.image} alt={selected.name} className="details__img" />
        )}

        <div>
          <span className="badge">{selected.category}</span>
          <h1>{selected.name}</h1>

          <p>
            <b>Date:</b> {formatDate(selected.date)}
          </p>
          <p>
            <b>Venue:</b> {selected.venue}
          </p>
          <p>
            <b>Location:</b> {selected.city}, {selected.country}
          </p>

          {selected.genre && (
            <p>
              <b>Type:</b> {selected.genre}
            </p>
          )}

          {selected.price && (
            <p>
              <b>Tickets:</b> {selected.price}
            </p>
          )}

          <button
            className="btn btn--primary"
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
            <p>
              <a href={selected.url} target="_blank" rel="noreferrer">
                View on Ticketmaster
              </a>
            </p>
          )}
        </div>
      </div>

      {selected.info && (
        <div>
          <h2>About this event</h2>
          <p>{selected.info}</p>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
