/* eslint-disable react/prop-types */
import { useGameContext } from "../../pages/Game";

function PrintBoxBumber({ rowIdx, colIdx, color }) {
  const { rotateBoard, themeColor } = useGameContext();
  return (
    <>
      {(colIdx === 0 && rotateBoard === "rotate(0deg)") ||
      (colIdx === 7 && rotateBoard === "rotate(180deg)") ? (
        <div
          className={`absolute ${
            rotateBoard === "rotate(0deg)"
              ? "top-0 left-0"
              : "bottom-0 right-0 rotate-180"
          } text-[10%] scale-[0.8] font-bold p-[0.05rem]`}
          style={{
            color:
              themeColor.dark === color ? themeColor.light : themeColor.dark,
          }}
        >
          {8 - rowIdx}
        </div>
      ) : null}

      {(rowIdx === 7 && rotateBoard === "rotate(0deg)") ||
      (rowIdx === 0 && rotateBoard === "rotate(180deg)") ? (
        <div
          className={`absolute ${
            rotateBoard === "rotate(0deg)"
              ? "bottom-0 right-0"
              : "top-0 left-0 rotate-180"
          } text-[10%] scale-[0.8] font-bold p-[0.05rem]`}
          style={{
            color:
              themeColor.dark === color ? themeColor.light : themeColor.dark,
          }}
        >
          {String.fromCharCode(97 + colIdx)}
        </div>
      ) : null}
    </>
  );
}

export default PrintBoxBumber;
