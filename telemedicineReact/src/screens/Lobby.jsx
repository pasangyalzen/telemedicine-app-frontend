import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const LobbyScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get("email") || "";
  const initialRoom = queryParams.get("room") || "";
  const initialAppointmentId = queryParams.get("appointmentId") || initialRoom;

  const [email, setEmail] = useState(initialEmail);
  const [room, setRoom] = useState(initialRoom);
  const [appointmentId, setAppointmentId] = useState(initialAppointmentId);

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !room || !appointmentId) return;
      socket.emit("room:join", { email, room, appointmentId });
    },
    [email, room, appointmentId, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room, appointmentId } = data;
      navigate(`/room/${room}?appointmentId=${appointmentId}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (initialEmail && initialRoom && initialAppointmentId) {
      socket.emit("room:join", {
        email: initialEmail,
        room: initialRoom,
        appointmentId: initialAppointmentId,
      });
    }
  }, [initialEmail, initialRoom, initialAppointmentId, socket]);

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-teal-700">
          Join a Video Call
        </h1>
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="room" className="block text-sm font-semibold text-gray-700 mb-1">
              Room Code (Appointment ID)
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setAppointmentId(e.target.value);
              }}
              placeholder="e.g. 2036"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
          >
            Join Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default LobbyScreen;