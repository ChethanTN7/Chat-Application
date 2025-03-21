import React from "react";
import RecipientsComponents from "./RecipientsComponents";

const ShareRecipientsComponents = ({
  recipientDetails,
  setRecipientDetails,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div
      className={`fixed max-h-[80vh] w-60 border-2 p-3 bg-white border-gray-400 left-[50%] top-[50%] transform translate-x-[-100%] translate-y-[-50%] rounded-xl ${
        !isOpen && "hidden"
      }`}
    >
      <h1 className="text-2xl font-bold text-gray-600 font-mono">
        Select Recipient
      </h1>
      <RecipientsComponents
        recipientDetails={recipientDetails}
        setRecipientDetails={setRecipientDetails}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default ShareRecipientsComponents;
