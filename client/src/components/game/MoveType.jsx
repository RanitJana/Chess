/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

function MoveType({ bgColor, value }) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`w-5 h-5 flex justify-center items-center font-bold aspect-square rounded-full text-white`}
    >
      {value}
    </div>
  );
}

export default MoveType;
