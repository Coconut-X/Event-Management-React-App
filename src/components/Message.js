import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearMessage } from "../features/registrations/registrationsSlice";

//green or red bar shown after registering or cancelling
function Message({ message }) {
  const dispatch = useDispatch();

  //hide it by itself after 4 seconds
  //the cleanup stops the old timer if a new message comes before that
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => dispatch(clearMessage()), 4000);
    return () => clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return null;

  //sits on top of the page so the feedback is hard to miss
  return (
    <div className={`toast toast--${message.type}`}>
      <span>{message.text}</span>
      <button onClick={() => dispatch(clearMessage())}>&times;</button>
    </div>
  );
}

export default Message;
