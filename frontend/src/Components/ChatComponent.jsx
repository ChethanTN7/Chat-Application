import React, { useEffect, useState, useRef } from "react";
import MessagesComponent from "./MessagesComponent";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import MyImage from "../Images/chatLOGO-removebg-preview.png";
import { IoSend, IoAttachSharp } from "react-icons/io5";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatComponent = ({ recipientDetails, setRecipientDetails }) => {
  const { id } = useParams();
  const divRef = useRef(null);

  const [socket, setSocket] = useState();

  let date,
    prevDate = new Date(0);

  const [recipient, setRecipient] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (recipientDetails) {
      setRecipient(recipientDetails.name);
      setRecipientId(recipientDetails._id);
    }
  }, [recipientDetails]);

  useEffect(() => {
    if (recipientId) {
      socket && socket.disconnect();
      const s = io("http://localhost:5000", {
        path: "/socket/chat",
        query: { id: id, rid: recipientId },
      });
      setSocket(s);
    }
  }, [recipientId]);

  useEffect(() => {
    const getMessages = async () => {
      const response = await axios.put("/get/messages", {
        id: id,
        rid: recipientId,
      });
      setMessages(response.data.messages);
    };
    getMessages();
  }, [recipientId]);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim() != "") {
      socket.emit("message", { msg: messageInput, date: Date.now() });
      setMessages([
        ...messages,
        { type: "send", content: messageInput, date: Date.now() },
      ]);
      setMessageInput("");
    }
  };

  socket &&
    socket.on("chat" + id, (message) => {
      if (message.id == recipientId) {
        setMessages([
          ...messages,
          { type: "recieve", content: message.msg, date: message.date },
        ]);
      }
    });

  return (
    <>
      <div
        className="flex flex-col w-[85%] pl-3"
        style={{
          backgroundImage: `url('${MyImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {recipientDetails && (
          <div className="flex flex-row justify-between items-center mb-2">
            <div className="flex flex-row items-center">
              <div className="w-[40px] h-[40px] bg-blue-400 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-black">
                <p className="text-white text-3xl font-bold font-serif uppercase">
                  {recipient && recipient[0]}
                </p>
              </div>
              <p className="text-2xl font-serif text-black capitalize">
                {recipient}
              </p>
            </div>
            <div className="mr-3">
              <Menu>
                <MenuButton>
                  <GiHamburgerMenu className="text-2xl" />
                </MenuButton>
                <MenuItems
                  anchor="bottom"
                  className="bg-white p-3 shadow-md rounded-lg"
                >
                  <MenuItem>
                    <a
                      className="block data-[focus]:bg-blue-100"
                      href="/settings"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      className="block data-[focus]:bg-blue-100"
                      href="/support"
                    >
                      Support
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      className="block data-[focus]:bg-blue-100"
                      href="/license"
                    >
                      License
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        )}
        <hr />

        {recipientDetails && (
          <div className="h-full w-full flex flex-col items-center">
            <div
              className="h-[88%] w-full pt-5 pb-9 flex flex-col gap-2 overflow-scroll"
              id="scroll"
              ref={divRef}
            >
              {messages.map((ele, index) => {
                date = new Date(ele.date);
                if (
                  date.toLocaleDateString() !== prevDate.toLocaleDateString()
                ) {
                  prevDate = date;
                  return (
                    <MessagesComponent message={ele} key={index} date={true} />
                  );
                }

                return (
                  <MessagesComponent message={ele} key={index} date={false} />
                );
              })}
            </div>

            <div className=" w-[80%] h-[5%] p-2 rounded-md flex flex-row items-center justify-between bg-blue-200 mt-2 shadow-sm shadow-gray-800">
              <div className="flex flex-row items-center w-[95%]">
                <IoAttachSharp className="text-2xl" />
                <input
                  type="text"
                  className="border-none outline-none bg-transparent w-[95%]"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
              </div>
              <IoSend className="text-2xl" onClick={() => handleSend()} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatComponent;
