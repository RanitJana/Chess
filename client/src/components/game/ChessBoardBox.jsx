/* eslint-disable react/prop-types */
import { useGameContext } from "../../pages/Game.jsx";
import { colors, getPieceImagePath } from "../../constants.js";
import PossibleMoveBoxMark from "./PossibleMoveBoxMark.jsx";
import RecentMoveColor from "./RecentMoveColor.jsx";
import pawnUpdatePieces from "../../utils/game/PawanUpdatePieces.js";
import { getSquareFromMove } from "../../utils/game/getSquareNames.js";
import KingSticker from "./KingSticker.jsx";
import PrintBoxBumber from "./PrintBoxBumber.jsx";

const pawnPromotionPieces = ["q", "r", "b", "n"];

function ChessBoardBox({
  color,
  piece,
  rowIdx,
  colIdx,
  pieceColor,
  square,
  possibleMoves,
  handleChessBoxClick,
  pawnPieceDisplay,
  setPawnPromotion,
  setPawnPieceDisplay,
  updatePieceNewLocation,
}) {
  const { rotateBoard, themeColor, users } = useGameContext();

  return (
    <div
      onClick={() => handleChessBoxClick(square)}
      style={{ backgroundColor: color }}
      className="relative w-full aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab"
    >
      <PossibleMoveBoxMark square={square} possibleMoves={possibleMoves} />
      <RecentMoveColor square={square} />
      <KingSticker pieceColor={pieceColor} piece={piece} />

      <PrintBoxBumber colIdx={colIdx} rowIdx={rowIdx} color={color} />

      {piece && (
        <img
          src={getPieceImagePath(piece)}
          alt={piece}
          className="z-10 absolute left-0 bottom-0 p-[1px]"
          style={{ transform: rotateBoard }}
        />
      )}
      {pawnPieceDisplay == square && (
        <ul
          className={`absolute w-full left-0 top-0 z-[100] box shadow-lg shadow-black`}
          style={{
            transform:
              rotateBoard +
              `${rotateBoard == "rotate(180deg)" ? "translateY(75%)" : ""}`,
          }}
        >
          {pawnUpdatePieces(users.you?.color).map((val, idx) => (
            <li
              onClick={() => {
                const pieceMoveLocation = possibleMoves.filter((val) => {
                  return getSquareFromMove(val, users.you?.color) == square;
                });

                const name =
                  users.you?.color == colors.white
                    ? pawnPromotionPieces[idx].toUpperCase()
                    : pawnPromotionPieces[idx];

                updatePieceNewLocation(
                  `${pieceMoveLocation[0]?.split("=")[0] + "=" + name}`
                );

                setPawnPromotion(false);
                setPawnPieceDisplay(false);
              }}
              key={idx}
              className={`relative aspect-square flex items-center justify-center hover:cursor-pointer active:cursor-grab p-[2px]`}
              style={{
                backgroundColor: idx & 1 ? themeColor.dark : themeColor.light,
              }}
            >
              <img src={val} alt="" decoding="async" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChessBoardBox;
