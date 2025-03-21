import React, { useEffect, useState } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import ShareRecipientsComponents from "../Components/ShareRecipientsComponents";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const SharePage = () => {
  const { id } = useParams();
  const [recipientDetails, setRecipientDetails] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [file, setFile] = useState();
  const [socket, setSocket] = useState();
  const [isReceiving, setIsReceiving] = useState(false);
  const [acceptDialogue, setAcceptDilogue] = useState(false);

  useEffect(() => {
    if (recipientDetails) {
      setRecipient(recipientDetails.name);
      setRecipientId(recipientDetails._id);
    }
  }, [recipientDetails]);

  // useEffect(() => {
  //   socket && socket.close();
  //   const s = io("http://localhost:5000", {
  //     path: "/socket/share",
  //     // query: { id: id, rid: recipientId },
  //   });
  //   setSocket(s);
  // }, []);

  useEffect(() => {
    if (recipientId) {
      const selectFile = async () => {
        const fileHandle = await window.showOpenFilePicker({
          multiple: false, // Set to true if you want to allow multiple file selection
        });
        const selectedFile = await fileHandle[0].getFile();
        setFile(selectedFile);
      };
      selectFile();
    }
  }, [recipientId]);

  const handleSend = () => {
    socket && socket.disconnect();
    const s = io("http://localhost:5000", {
      path: "/socket/share",
      // query: { id: id, rid: recipientId },
    });
    setSocket(s);
  };

  const handleReceive = () => {
    socket && socket.close();
    const s = io("http://localhost:5000", {
      path: "/socket/share",
      // query: { id: id, rid: recipientId },
    });
    setSocket(s);
    setIsReceiving(true);
  };

  useEffect(() => {
    if (file) {
      // console.log(file.name, file.size, file.type);

      socket &&
        socket.emit("init", {
          id,
          recipientId,
          metaData: { name: file.name, size: file.size, type: file.type },
        });
      console.log("logging");
    }
  }, [file]);

  useEffect(() => {
    socket &&
      socket.on("init" + id, (data) => {
        setAcceptDilogue(true);
      });
  });

  const handleAccept = (accept) => {
    setAcceptDilogue(false);
    socket && socket.emit("accept", { id, accept });
  };

  if (isReceiving) {
    return (
      <>
        {acceptDialogue && (
          <div className="w-[30vw] font-serif min-h-20 fixed top-2 gap-4 rounded-lg bg-white border-2 shadow-md shadow-black left-1/2 translate-x-[-50%] flex flex-col items-center justify-between p-3">
            <h1 className="text-xl">Are you sure?</h1>
            <div className="flex gap-4">
              <button
                className="text-green-700 px-2 rounded-lg hover:bg-green-700 hover:text-white border-2 border-green-700"
                onClick={() => handleAccept(1)}
              >
                Accept
              </button>
              <button
                className="text-red-700 px-2 rounded-lg hover:bg-red-700 hover:text-white border-2 border-red-700"
                onClick={() => handleAccept(0)}
              >
                Reject
              </button>
            </div>
          </div>
        )}

        <div className="ml-[80px] p-5 bg-white rounded-3xl m-3 w-[75%] h-[97vh] flex flex-col items-center justify-center">
          <div className="w-[20em] h-[20em] text-white text-2xl font-bold font-mono rounded-full border-2 bg-[radial-gradient(rgb(200,200,255),rgb(150,150,255),rgb(100,100,255),rgb(50,50,255),rgb(0,0,255))] flex items-center justify-center animate-pulse">
            Receiving...
          </div>
          <button
            className="absolute translate-y-40 underline text-blue-900 px-2 rounded hover:text-white"
            onClick={() => {
              socket && socket.disconnect();
              setIsReceiving(false);
            }}
          >
            Stop Receiving
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ml-[80px] p-5 bg-white rounded-3xl m-3 w-[75%] h-[97vh] flex flex-row">
        <div className="flex gap-2 items-center justify-center w-full">
          <button
            className="border-[5px] border-green-700 rounded-xl px-4 py-1 text-3xl w-40 text-green-700 hover:bg-green-700 hover:text-white transition"
            onClick={() => {
              handleSend();
              setIsOpen(true);
            }}
          >
            Send
          </button>
          <button
            className="border-[5px] border-blue-700 rounded-xl px-4 py-1 text-3xl w-40 text-blue-700 hover:bg-blue-700 hover:text-white transition"
            onClick={() => handleReceive()}
          >
            Receive
          </button>
        </div>
        <ShareRecipientsComponents
          recipientDetails={recipientDetails}
          setRecipientDetails={setRecipientDetails}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
};

export default DefaultLayout(SharePage);
