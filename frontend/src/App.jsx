import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

function App() {
  const messageBox = useRef(null);
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
      socket.off("connect");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center gap-5">
      <h1 className="text-white font-bold text-[3rem] mt-">TalkConnect</h1>
      <div className="w-[40rem] max-w-[40rem] mx-3 [@media(max-width:660px)_and_(min-width:500px)]:w-120  [@media(max-width:500px)]:w-[20rem] h-[30rem] bg-gray-900 border-2 border-gray-400 overflow-auto flex flex-col ">
        {messages.map((message, index) => {
          return (
            <div
              className={`flex flex-col w-fit h-fit text-white ml-5 mt-3 ${
                message.sender === myId ? "bg-green-700" : "bg-gray-600"
              } p-2 rounded border-1`}
              key={index}
            >
              <div className="text-gray-300 italic">
                {message.sender === myId ? "You" : "Friend"}
              </div>
              <p className="text-[1.3rem]">{message.text}</p>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-3 mb-5">
        <textarea
          className="border-2 border-white w-[40rem] [@media(max-width:660px)_and_(min-width:500px)]:w-120  [@media(max-width:500px)]:w-[20rem] outline-none p-2 text-white"
          placeholder="Write your message here"
          ref={messageBox}
          autoFocus
        ></textarea>
        <button
          className="w-[40rem] [@media(max-width:660px)_and_(min-width:500px)]:w-120  [@media(max-width:500px)]:w-[20rem] bg-green-600 text-[1.2rem] py-1 rounded cursor-pointer hover:bg-green-700 duration-300"
          onClick={() => {
            socket.emit("message", messageBox.current.value);
            messageBox.current.value = "";
            messageBox.current.focus();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
