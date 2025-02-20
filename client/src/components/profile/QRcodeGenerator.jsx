/* eslint-disable react/prop-types */
import QRCode from "qrcode";
import { useEffect, useRef } from "react";
import GetAvatar from "../../utils/GetAvatar";

function QRcodeGenerator({ userId, username, setIsOpenQr }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const canvas = canvasRef.current;

        // Generate the QR code
        await QRCode.toCanvas(canvas, window.location.href, {
          width: 275,
          color: {
            dark: "#4ade80", // Green QR color
            light: "#000", // Black background
          },
        });
      } catch (err) {
        console.error(err);
      }
    };

    generateQR();
  }, [userId]);

  return (
    <div className="flex items-center justify-center fixed top-0 left-0 w-dvw h-dvh bg-[rgba(0,0,0,0.5)] z-[9999]">
      <div className="p-4 bg-blackDarkest rounded-md flex flex-col items-end gap-3">
        <button className="h-6 w-6" onClick={() => setIsOpenQr(false)}>
          <img src="/images/cross.png" alt="" className="w-6" />
        </button>
        <div className="flex flex-col gap-4">
          <div className="relative w-[15rem] h-[15rem] overflow-hidden flex items-center justify-center bg-white p-2 rounded-md">
            <div className="absolute z-10 bg-black p-3 rounded-md">
              <div
                dangerouslySetInnerHTML={{ __html: GetAvatar(username) }}
                className="w-10 overflow-hidden rounded-md"
              />
            </div>
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
          </div>
          <p className="font-bold text-green-400 text-center">{username}</p>
        </div>
      </div>
    </div>
  );
}

export default QRcodeGenerator;
