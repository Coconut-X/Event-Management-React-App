// All Ticketmaster API calls live here.
// API key comes from .env (REACT_APP_TM_API_KEY)

const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = process.env.REACT_APP_TM_API_KEY;

// Get a list of events. All params are optional.
export async function searchEvents(filters) {
  const { keyword, city, category, date, page } = filters;

  let url = `${BASE_URL}/events.json?apikey=${API_KEY}&size=20&sort=date,asc`;

  if (keyword) url += `&keyword=${keyword}`;
  if (city) url += `&city=${city}`;
  if (category) url += `&classificationName=${category}`;
  if (date) url += `&startDateTime=${date}T00:00:00Z`;
  if (page) url += `&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not load events");

  const data = await res.json();

  // _embedded is missing when there are no results
  const events = data._embedded ? data._embedded.events : [];

  return {
    events: events.map(makeEvent),
    totalPages: data.page.totalPages,
    currentPage: data.page.number,
  };
}

// Get one event by id
export async function getEvent(id) {
  const res = await fetch(`${BASE_URL}/events/${id}.json?apikey=${API_KEY}`);
  if (!res.ok) throw new Error("Could not load this event");

  const data = await res.json();
  return makeEvent(data);
}

// The API response is nested really deep, so we pull out only what we need
function makeEvent(e) {
  const venue = e._embedded && e._embedded.venues ? e._embedded.venues[0] : null;
  const type = e.classifications ? e.classifications[0] : null;

  return {
    id: e.id,
    name: e.name,
    url: e.url,
    info: e.info || "",
    date: e.dates.start.dateTime || e.dates.start.localDate,
    image: e.images && e.images.length > 0 ? e.images[0].url : null,
    venue: venue ? venue.name : "Not announced",
    city: venue && venue.city ? venue.city.name : "",
    country: venue && venue.country ? venue.country.name : "",
    category: type && type.segment ? type.segment.name : "Other",
  };
}
