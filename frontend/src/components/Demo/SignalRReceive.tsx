import { FC, useEffect, useState } from "react";
import { useHub } from "services/signalR/useHub";

const SignalRReceive: FC = () => {
  const { hub } = useHub("exampleHub");

  const [message, setMessage] = useState<string>(null);
  const [timeOfMsg, setTimeOfMsg] = useState<number>(null);

  useEffect(() => {
    hub.onEvent("receiveMessage", child => {
      setMessage(child);
      setTimeOfMsg(Date.now);
    });
  }, [hub]);

  return (
    <div>
      {message === null ? (
        <p>No new messages, unfortunately.</p>
      ) : (
        <div>
          <p>
            New Message! {message}
            <br />
            Created at: {new Date(timeOfMsg).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default SignalRReceive;
