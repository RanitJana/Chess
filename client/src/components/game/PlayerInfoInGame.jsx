/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import GetAvatar from "../../utils/GetAvatar.js";
import { useEffect, useState } from "react";
import { colors, getPieceImagePath } from "../../constants.js";
import { getColor } from "../../utils/PieceMove.js";

function PlayerInfoInGame({
  player = {},
  isOnline = false,
  opponentColor,
  chessboard,
}) {
  const navigate = useNavigate();
  const [opponentTakenPieces, setOpponentTakenPieces] = useState([]);
  const [initialPiecesCount, setInitialPiecesCount] = useState(null);

  useEffect(() => {
    // Initialize initial piece counts based on opponent color
    if (opponentColor === colors.black) {
      setInitialPiecesCount({ p: 8, r: 2, n: 2, b: 2, q: 1, k: 1 });
    } else if (opponentColor === colors.white) {
      setInitialPiecesCount({ P: 8, R: 2, N: 2, B: 2, Q: 1, K: 1 });
    }
  }, [opponentColor]);

  const getAllPieces = () => {
    // Initialize current piece counts based on opponent color
    let currentPiecesCount =
      opponentColor === colors.black
        ? { p: 0, r: 0, n: 0, b: 0, q: 0, k: 0 }
        : { P: 0, R: 0, N: 0, B: 0, Q: 0, K: 0 };

    chessboard?.forEach((row, rowIdx) => {
      row.forEach((piece, colIdx) => {
        if (
          piece !== " " &&
          getColor(chessboard, rowIdx, colIdx) === opponentColor
        ) {
          currentPiecesCount[piece] += 1;
        }
      });
    });

    // Calculate which pieces have been taken by the opponent
    const takenPieces = [];
    for (const piece in initialPiecesCount) {
      const taken = initialPiecesCount[piece] - currentPiecesCount[piece];
      if (taken > 0) {
        for (let i = 0; i < taken; i++) {
          takenPieces.push(piece);
        }
      }
    }
    setOpponentTakenPieces(takenPieces);
  };

  useEffect(() => {
    if (initialPiecesCount) {
      getAllPieces();
    }
  }, [chessboard, initialPiecesCount]);

  if (!player) return;
  return (
    <div className="flex justify-between items-center">
      <div className="flex py-2 gap-4">
        <div className="relative">
          <div className=" relative h-10 aspect-square rounded-xl bg-white overflow-hidden">
            <div
              dangerouslySetInnerHTML={{ __html: GetAvatar(player?.name) }}
            />
          </div>
          {isOnline && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-3 aspect-square rounded-full bg-green-600"></div>
          )}
        </div>
        <div className="w-full">
          <p className="text-sm">
            <span
              onClick={() => navigate(`/member/${player._id}`)}
              className="text-white font-semibold mr-1 hover:cursor-pointer"
            >
              {player.name}
            </span>
            <span className="text-gray-400">({player.rating})</span>
          </p>
          <div className="flex justify-start relative">
            {opponentTakenPieces?.map((piece, idx) => {
              return (
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
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-evenly gap-1 w-full max-w-[7rem] bg-white p-2 rounded-md">
        <img src="/images/time.gif" alt="" />
        <span>3 days</span>
      </div>
    </div>
  );
}

export default PlayerInfoInGame;
