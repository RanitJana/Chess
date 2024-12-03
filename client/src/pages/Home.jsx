/* eslint-disable no-unused-vars */
import React from "react";
import { useSocketContext } from "../context/SocketContext.jsx";

function Home() {

  const { totalOnline } = useSocketContext();

  return (
    <div className="w-full flex justify-center items-center h-fit sm:p-8 p-4 gap-10 flex-wrap" >
      <div>
        <img src="/images/standardboard.png" width={450} />
      </div>
      <div>
        <div className="max-w-[30rem] flex flex-col items-center" >
          <h2 className="text-white font-extrabold md:text-[3.2rem] sm:text-[2.2rem] text-[2rem] text-wrap line-clamp-2 text-center leading-[3.5rem]" >Play Chess Online on the #2 Site!</h2>
          <div className="flex w-full justify-between px-10 my-5 sm:flex-row flex-col items-center gap-1" >
            <div>
              <span className="text-white font-bold">15,145,763</span>
              <span className="pl-1 text-gray-400 font-bold">Games Today</span>
            </div>
            <div>
              <span className="text-white font-bold">{totalOnline}</span>
              <span className="pl-1 text-gray-400 font-bold">Playing Now</span>
            </div>
          </div>
          <button
            className={`bg-buttonLight w-full max-w-[25rem] rounded-lg h-12 p-4 py-3 hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.5rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] mt-4 `}
          >
            <img src="/images/play.svg" alt="" className="w-[4rem]" />
            <div className="flex flex-col justify-center items-start">
              <span className="text-3xl text-wrap" >Play Online</span>
              <span className="text-sm font-normal" >Play with someone at your level</span>
            </div>
          </button>
        </div>
      </div>
    </div >
  );
}

export default Home;
