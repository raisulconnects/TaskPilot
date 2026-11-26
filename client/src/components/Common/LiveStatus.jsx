import { useCallback, useSyncExternalStore } from "react";
import { useAuthContext } from "../../context/AuthContext";

// Reflects the real Socket.IO connection state, so "Live" only shows when
// realtime updates are actually flowing.
function useSocketConnected() {
  const { socket } = useAuthContext();

  const subscribe = useCallback(
    (notify) => {
      if (!socket) return () => {};
      socket.on("connect", notify);
      socket.on("disconnect", notify);
      return () => {
        socket.off("connect", notify);
        socket.off("disconnect", notify);
      };
    },
    [socket]
  );

  return useSyncExternalStore(subscribe, () => !!socket?.connected);
}

export default function LiveStatus() {
  const connected = useSocketConnected();

  return (
    <span
      title={connected ? "Realtime updates are on" : "Reconnecting to realtime updates…"}
      className={`inline-flex items-center gap-2 h-9 px-3 rounded-pill border text-xs font-medium ${
        connected
          ? "border-mint bg-mint/25 text-forest"
          : "border-mist bg-snow text-iron"
      }`}
    >
      <span className="relative flex w-2 h-2">
        {connected && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        )}
        <span
          className={`relative inline-flex w-2 h-2 rounded-full ${
            connected ? "bg-green-500" : "bg-fog"
          }`}
        />
      </span>
      {connected ? "Live" : "Offline"}
    </span>
  );
}
