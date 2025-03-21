import React from "react";
import { IoChatboxEllipsesSharp, IoShareSocialOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import MyImage from "../Images/chatLOGO-removebg-preview.png";

const NavbarComponent = () => {
  const { id } = useParams();
  return (
    <>
      <div className="absolute left-0 h-[97vh] w-[80px] flex items-center flex-col p-2 ">
        <div className="rounded-full w-[70px] h-[70px]">
          <img src={MyImage} alt="Logo" className="scale-150" />
        </div>

        <div className="text-2xl font-bold w-6 text-center h-[75%] break-words bg-gradient-to-r from-white to-black bg-clip-text text-transparent">
          CHATMATE
        </div>
        <div className="text-3xl text-white h-[20%]">
          <Link to={`/home/${id}`}>
            <div className="relative mb-8 cursor-pointer">
              <IoChatboxEllipsesSharp />
              <span className="text-white text-sm absolute">Chats</span>
            </div>
          </Link>
          <Link to={`/share/${id}`}>
            <div className="relative mb-8 cursor-pointer">
              <IoShareSocialOutline />
              <span className="text-white text-sm absolute">Share</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavbarComponent;
