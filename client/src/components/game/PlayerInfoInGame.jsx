/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import GetAvatar from "../../utils/GetAvatar.js";
import { useEffect, useState } from "react";
import { colors, getPieceImagePath } from "../../constants.js";
import getCountryNameFlag from "../../utils/getCountryNameFlag.js";
import piecePoint from "../../utils/PiecePoints.js";

function PlayerInfoInGame({
  player = {},
  isOnline = false,
  opponentColor,
  allMoves,
  points,
  setPoints,
}) {
  const navigate = useNavigate();
  const [opponentTakenPieces, setOpponentTakenPieces] = useState([]);
  const [flagInfo, setFlagInfo] = useState({});

  const getAllPieces = () => {
    // Calculate which pieces have been taken by the opponent
    const takenPieces = [];
    allMoves.forEach((move) => {
      if (move.color != opponentColor?.[0] && move.captured)
        takenPieces.push(
          move.color == "w" ? move.captured : move.captured.toUpperCase()
        );
    });

    const sum = takenPieces.reduce((sum, piece) => sum + piecePoint(piece), 0);

    if (opponentColor == colors.black)
      setPoints((prev) => ({ ...prev, [colors.white]: sum }));
    else setPoints((prev) => ({ ...prev, [colors.black]: sum }));

    setOpponentTakenPieces(takenPieces);
  };

  useEffect(() => {
    getAllPieces();
  }, [allMoves]);

  useEffect(() => {
    if (player.nationality == null || player.nationality == undefined) return;
    const info = getCountryNameFlag(player.nationality);
    setFlagInfo(info);
  }, [player.nationality]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex py-2 gap-4">
        <div className="relative">
          <div className=" relative h-10 aspect-square rounded-xl bg-gray-300 overflow-hidden">
            {player.name ? (
              <div
                dangerouslySetInnerHTML={{ __html: GetAvatar(player.name) }}
              />
            ) : (
              ""
            )}
          </div>
          {isOnline && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-3 aspect-square rounded-full bg-green-600"></div>
          )}
        </div>
        <div className="w-full">
          <p className="text-sm line-clamp-1 flex gap-1 overflow-hidden text-white">
            <span
              onClick={() => navigate(`/member/${player._id}`)}
              className="text-white font-semibold hover:cursor-pointer"
            >
              {player.name || "Loading.."}
            </span>
            <span className="text-gray-400">({player.rating || "200"})</span>
            {flagInfo && (
              <img
                src={flagInfo.link}
                title={flagInfo.name}
                alt=""
                className="w-8 bg-gray-300"
              />
            )}
          </p>
          <div className="flex justify-start relative">
            {opponentTakenPieces?.map((piece, idx) => (
              <img
                key={idx}
                src={getPieceImagePath(piece)}
                alt=""
                className="w-5"
                style={{
                  position: "absolute",
                  left: `${idx * 1.1}rem`,
                  zIndex: idx,
                  transform: `translateX(-${idx * 8}px)`,
                }}
              />
            ))}

            <div
              className="absolute h-5 flex items-center justify-center text-white text-xs"
              style={{
                left: `${opponentTakenPieces.length * 1.3}rem`,
                transform: `translateX(-${opponentTakenPieces.length * 8}px)`,
              }}
            >
              {opponentColor == colors.black && points.black < points.white ? (
                <div>+{points.white - points.black}</div>
              ) : null}
              {opponentColor == colors.white && points.black > points.white ? (
                <div>+{points.black - points.white}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-evenly gap-1 w-[5rem] bg-white p-2 rounded-md">
        <img src="/images/time.gif" alt="" className="w-4" />
        <span className="text-sm">3 days</span>
      </div>
    </div>
  );
}

export default PlayerInfoInGame;
