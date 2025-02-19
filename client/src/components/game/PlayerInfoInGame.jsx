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
        <div className="w-full break-words">
          <div className="text-sm flex gap-1 overflow-hidden text-white">
            <p className="line-clamp-1">
              <span
                onClick={() => navigate(`/member/${player._id}`)}
                className="text-white font-semibold hover:cursor-pointer"
              >
                {player.name || "Loading.."}
              </span>
              <span className="text-gray-400">({player.rating || "200"})</span>
            </p>
            {flagInfo && (
              <img
                src={flagInfo.link}
                title={flagInfo.name}
                alt=""
                className="w-8 bg-gray-300"
              />
            )}
          </div>
          <div
            className="flex justify-start relative"
            style={{ maxWidth: `${(opponentTakenPieces.length + 1) * 12}px` }}
          >
            {opponentTakenPieces.map((piece, idx) => (
              <img
                key={idx}
                src={getPieceImagePath(piece)}
                alt={piece}
                className="w-6"
                style={{
                  zIndex: idx,
                  transform: `translateX(-${idx * 12}px) rotate(${Math.floor(Math.random() * 31) - 15}deg)`,
                }}
              />
            ))}

            <div className="absolute right-0 translate-x-[102%] h-full flex items-center justify-center text-white text-xs">
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
      <div className="flex ml-2 items-center justify-evenly gap-1 min-w-[5rem] bg-white p-2 rounded-md">
        <img src="/images/time.gif" alt="" className="w-4" />
        <span className="text-sm">3 days</span>
      </div>
    </div>
  );
}

export default PlayerInfoInGame;
