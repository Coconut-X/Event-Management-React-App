import { Link } from "react-router-dom";
import { formatDate } from "../utils/helpers";

//used on the Events page and on My Events
//the button is passed as children because it is different on each page
function EventCard({ event, children }) {
  return (
    <div className="card">
      {event.image && (
        <img src={event.image} alt={event.name} className="card__img" />
      )}

      <div className="card__body">
        <span className="badge">{event.category}</span>
        <h3 className="card__title">{event.name}</h3>
        <p className="card__meta">{formatDate(event.date)}</p>
        <p className="card__meta">
          {event.venue}, {event.city}
        </p>
        {/*most events do not send a price so we only show it when they do*/}
        {event.price && <p className="card__meta">{event.price}</p>}

        <div className="card__actions">
          <Link to={`/events/${event.id}`} className="btn">
            Details
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
