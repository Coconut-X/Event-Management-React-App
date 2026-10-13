import { useDispatch } from "react-redux";
import { clearMessage } from "../features/registrations/registrationsSlice";

// Green/red bar shown after registering or cancelling
function Message({ message }) {
  const dispatch = useDispatch();

  if (!message) return null;

  return (
    <div className={`message message--${message.type}`}>
      {message.text}
      <button onClick={() => dispatch(clearMessage())}>x</button>
    </div>
  );
}

export default Message;
