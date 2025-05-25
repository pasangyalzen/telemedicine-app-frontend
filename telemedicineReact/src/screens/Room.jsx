import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"
import { markAppointmentCompleted } from "../pages/Admin/services/appointmentApi";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  const { room } = useParams(); // inside your component
const appointmentId = room;

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
    setIsCallActive(true);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
      setIsCallActive(true);
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMute = useCallback(() => {
    if (myStream) {
      const audioTracks = myStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [myStream, isMuted]);

  const toggleVideo = useCallback(() => {
    if (myStream) {
      const videoTracks = myStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [myStream, isVideoOff]);

  const endCall = useCallback(async () => {
  if (myStream) {
    myStream.getTracks().forEach(track => track.stop());
  }

  console.log("🔎 appointmentId:", appointmentId); // << Add this

  try {
    if (appointmentId) {
      console.log("➡ Marking appointment as completed for ID:", appointmentId);
      await markAppointmentCompleted(appointmentId);
      console.log("✅ Appointment marked as completed");
    } else {
      console.warn("❌ appointmentId not found in URL");
    }
  } catch (err) {
    console.error("❌ Failed to mark appointment completed", err);
  }

  setMyStream(null);
  setRemoteStream(null);
  setIsCallActive(false);

  const role = localStorage.getItem("role");
  switch (role) {
    case "Doctor":
      navigate("/doctor-waiting-room-dashboard");
      break;
    case "Patient":
      navigate("/patientdashboard");
      break;
    default:
      navigate("/");
      break;
  }
}, [myStream, navigate, appointmentId]);

  return (
    <div className="fixed inset-0 w-full h-screen bg-teal-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-teal-800 py-4 px-6 flex justify-between items-center shadow-lg">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-teal-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"></path>
          </svg>
          <h1 className="text-xl font-bold text-white ml-2">TELECHAUKI</h1>
        </div>
        <div className="flex flex-col items-end mr-4">
        <span className="text-teal-100">
          {remoteSocketId ? (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              Connected
            </span>
          ) : (
            <span className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-400 mr-2"></span>
              Waiting for connection
            </span>
          )}
        </span>

          <button
          onClick={() => {
            const role = localStorage.getItem("role");
            if (role === "Doctor") navigate("/doctor-waiting-room-dashboard");
            else if (role === "Patient") navigate("/patientdashboard");
            else navigate("/");
          }}
          className="mt-2 w-40 text-center px-3 py-1 rounded-md bg-red-200 text-red-700 hover:bg-red-300 transition-colors font-semibold"
        >
          ← Back
        </button>
        </div>
      </header>

      {/* Main Content - Takes remaining height */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        {/* Video Streams Display - Centered */}
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          {myStream ? (
            <div className="w-full flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Remote Video - Larger */}
              <div className="w-full md:w-3/5 relative rounded-lg overflow-hidden shadow-2xl bg-teal-800 border border-teal-700" style={{ height: "400px" }}>
                {remoteStream ? (
                  <ReactPlayer
                    playing
                    muted={false}
                    height="100%"
                    width="100%"
                    url={remoteStream}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xl text-teal-200">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4">Waiting for other participant...</p>
                    </div>
                  </div>
                )}
                
                {/* Remote user indicator */}
                {remoteStream && (
                  <div className="absolute top-4 left-4 bg-teal-900 bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Remote User</span>
                  </div>
                )}
              </div>
              
              {/* Local Video - Smaller PiP */}
              <div className="w-full md:w-2/5 relative rounded-lg overflow-hidden shadow-xl bg-teal-800 border border-teal-700" style={{ height: "250px" }}>
                <ReactPlayer
                  playing
                  muted
                  height="100%"
                  width="100%"
                  url={myStream}
                  className="rounded-lg"
                />
                
                {/* Local user indicator */}
                <div className="absolute top-4 left-4 bg-teal-900 bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>You</span>
                </div>
                
                {/* Muted indicator */}
                {isMuted && (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white p-1 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v14c0 .891-1.077 1.337-1.707.707L5.586 13z" clipRule="evenodd" />
                      <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  </div>
                )}
                
                {/* Video off indicator */}
                {isVideoOff && (
                  <div className="absolute bottom-4 right-4 bg-red-500 text-white p-1 rounded-full">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                      <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      <path d="M1 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xl bg-teal-800 rounded-lg p-8 shadow-2xl border border-teal-700">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto text-teal-300 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
                  <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                <h2 className="text-2xl font-semibold mb-2">Welcome to Telechauki</h2>
                <p className="text-teal-200 mb-6">Start a video call to connect with others</p>
                
                {remoteSocketId ? (
                  <button
                    onClick={handleCallUser}
                    className="bg-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-teal-600 transition-all duration-200"
                  >
                    Start Video Call
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="animate-pulse flex space-x-2 mb-4">
                      <div className="h-3 w-3 bg-teal-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-teal-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-teal-400 rounded-full"></div>
                    </div>
                    <p className="text-teal-300">Waiting for someone to join the room...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Call Controls */}
      {myStream && (
        
        <footer className="bg-teal-800 px-6 py-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex justify-center items-center space-x-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-500'}`}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v14c0 .891-1.077 1.337-1.707.707L5.586 13z" clipRule="evenodd" />
                  <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-500'}`}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  <path d="M1 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={sendStreams}
              className="bg-teal-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-teal-400 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Join
            </button>
            {/* <button
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1H3V4zM3 7h14v9a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
              </svg>
              View Reports
            </button> */}
            
            <button
              onClick={endCall}
              className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                <path d="M16.707 3.293a1 1 0 010 1.414L15.414 6l1.293 1.293a1 1 0 01-1.414 1.414L14 7.414l-1.293 1.293a1 1 0 11-1.414-1.414L12.586 6l-1.293-1.293a1 1 0 011.414-1.414L14 4.586l1.293-1.293a1 1 0 011.414 0z" />
              </svg>
              End Call
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default RoomPage;