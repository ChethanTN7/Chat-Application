import React, { useState, useEffect, useCallback } from "react";
import SearchComponent from "./SearchComponent";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecipientsComponents = ({
  recipientDetails,
  setRecipientDetails,
  setIsOpen,
}) => {
  let i = 0;
  const colors = [
    "#1E1E1E", // Dark Gray
    "#2D3748", // Charcoal
    "#4A5568", // Slate Gray
    "#0A0A0A", // Black
    "#2C3E50", // Midnight Blue
    "#4B0082", // Indigo
    "#FF5733", // Vibrant Orange
    "#3498DB", // Bright Blue
    "#27AE60", // Green
    "#8E44AD", // Purple
    "#F39C12", // Sunflower Yellow
    "#E74C3C", // Red
    "#16A085", // Greenish Blue
    "#F39C12", // Golden Yellow
    "#D35400", // Dark Orange
  ];

  const { id } = useParams();
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const getRecipients = async () => {
      const response = await axios.get(`/get/recipients/${id}`);
      setRecipients(response.data.data);
    };
    getRecipients();
  }, [id]);

  const handleClick = async (e) => {
    const email = prompt("Enter the email id", "");
    if (!email) return;
    try {
      const response = await axios.put(`/add/recipient/${id}`, { email });
      if (response.status == 200) {
        setRecipients(response.data.user);
        alert("User added successfully");
      } else alert(response.data.message);
    } catch (error) {
      alert("Error occured during adding recipient");
    }
  };

  return (
    <>
      <div className="min-w-[15%] flex flex-col overflow-hidden h-full">
        <SearchComponent />
        <div
          className="flex flex-col mt-2 h-full overflow-y-auto gap-1"
          id="scroll"
        >
          {recipients.map((ele, index) => {
            if (i == 15) {
              i = 0;
            }
            return (
              <div
                className="flex flex-row bg-[rgba(220,220,220,0.5)] rounded-lg p-1 items-center shadow-sm shadow-gray-800 mb-[0.5px] cursor-pointer"
                key={index}
                onClick={() => {
                  setRecipientDetails(ele);
                  setIsOpen && setIsOpen(false);
                }}
              >
                <div
                  className="w-[40px] h-[40px] rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors[i++] }}
                >
                  <p className="text-white text-3xl font-bold font-serif uppercase">
                    {ele.name[0]}
                  </p>
                </div>
                <p className="text-black ml-1 text-md font-serif capitalize">
                  {ele.name}
                </p>
              </div>
            );
          })}
          <div
            className="flex flex-row bg-[rgba(20,20,20,0.5)] rounded-lg p-1 items-center shadow-sm shadow-gray-800 mb-[0.5px] cursor-pointer"
            onClick={() => handleClick()}
          >
            <div className="w-[40px] h-[40px] rounded-lg flex items-center justify-center bg-gray-900">
              <p className="text-white text-3xl font-bold font-serif uppercase">
                +
              </p>
            </div>
            <p className="text-black ml-1 text-md font-serif capitalize">
              Add Recipient
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipientsComponents;
