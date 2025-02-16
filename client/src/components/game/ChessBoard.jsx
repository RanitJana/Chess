import { useState } from "react";
import PlayerInfoInGame from "./PlayerInfoInGame.jsx";
import ChessBoardBox from "./ChessBoardBox.jsx";
import EmptyBoard from "./EmptyBoard.jsx";
import { colors, winReason, getScore } from "../../constants.js";
import { useGameContext } from "../../pages/Game.jsx";
import {
  getSquareName,
  getSquareFromMove,
} from "../../utils/game/getSquareNames.js";
import { socket } from "../../socket.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { gameMove, gameEnd } from "../../api/game.js";
import Toast from "../../utils/Toast.js";

function ChessBoard() {
  const {
    boardStates,
    setBoardStates,
    users,
    opponent,
    moves,
    setMoves,
    themeColor,
    rotateBoard,
    gameId,
    isCheckMate,
    setCheckMate,
    setWinnerReason,
    setScore,
    moveIndex,
  } = useGameContext();
  const { onlineUsers } = useSocketContext();

  const [possibleMoves, setPossibleMoves] = useState([]);
  const [points, setPoints] = useState(0);
  const [pawnPromotion, setPawnPromotion] = useState(false);
  const [pawnPieceDisplay, setPawnPieceDisplay] = useState(false);

  const updatePieceNewLocation = async (pieceMoveLocation) => {
    setPossibleMoves([]);

    boardStates.board?.move(pieceMoveLocation);
    const boardInfo = boardStates.board.fen().split(" ");
    const history = boardStates.board?.history({ verbose: true }) || [];

    try {
      gameMove({
        gameId,
        board: boardStates.board.fen(),
        moves: [...moves, history[history.length - 1]],
      });

      if (boardStates.board.isCheckmate()) {
        const whoWon = users.you?.color;
        const winnerReason = winReason.byCheckmate;

        let score;
        if (users.you?.colors == colors.black)
          score = getScore(users.you?.rating, users.opponent?.rating, 1);
        else score = getScore(users.you?.rating, users.opponent?.rating, 0);

        const { data } = await gameEnd({
          gameId,
          winner: whoWon,
          reason: winnerReason,
          score,
        });

        if (data?.success) {
          setCheckMate(whoWon);
          setWinnerReason(winnerReason);
          setScore(score);
        }
      }
    } catch (error) {
      console.log(error);
      Toast.error("Unable to update the move");
    }

    setMoves((prev) => [...prev, history[history.length - 1]]);

    setBoardStates((prev) => ({
      board: prev.board,
      turn: boardInfo[1] == "w" ? colors.white : colors.black,
      castling: boardInfo[2],
      enPassant: boardInfo[3],
      move: {
        half: parseInt(boardInfo[4]),
        full: parseInt(boardInfo[5]),
      },
    }));

    socket.emit("move-done", {
      fen: boardStates.board.fen(),
      lastMove: JSON.stringify(history[history.length - 1]),
    });
  };

  const handleChessBoxClick = (square) => {
    if (
      users.you?.color[0] != boardStates.turn[0] ||
      isCheckMate ||
      moveIndex < moves?.length - 1
    )
      return;

    const pieceMoveLocation = possibleMoves.filter((val) => {
      return getSquareFromMove(val, users.you?.color) == square;
    });

    if (possibleMoves.length && pieceMoveLocation.length) {
      if (pawnPromotion && !pawnPieceDisplay)
        return setPawnPieceDisplay(square);

      updatePieceNewLocation(pieceMoveLocation[0]);
    } else {
      const tempMoves = boardStates.board?.moves({ square });
      if (tempMoves.length && tempMoves[0].indexOf("=") != -1)
        setPawnPromotion(true);
      setPossibleMoves(tempMoves);
    }
  };

  return (
    <div className=" w-full flex items-center justify-center h-fit">
      <div className="grid grid-cols-1 gap-0 md:w-full w-[min(100%,80dvh)] h-fit">
        <PlayerInfoInGame
          player={users.opponent || {}}
          isOnline={onlineUsers[opponent?._id]}
          opponentColor={users.you?.color}
          allMoves={moves}
          points={points}
          setPoints={setPoints}
        />
        <div
          className="relative w-full h-fit items-center justify-center flex flex-col"
          style={{ transform: rotateBoard }}
        >
          {/* empty chessboard */}
          {!boardStates.board && (
            <div className="relative w-full h-fit">
              <EmptyBoard />
            </div>
          )}
          {boardStates.board?.board().map((row, rowIdx) => (
            <div className="grid grid-cols-8 w-full" key={rowIdx}>
              {row.map((piece, colIdx) => {
                const pieceColor = piece?.color;
                const key = colIdx + rowIdx;
                const color = key & 1 ? themeColor.dark : themeColor.light;
                const square = piece
                  ? piece.square
                  : getSquareName(rowIdx, colIdx);
                piece = piece
                  ? piece.color == "w"
                    ? piece.type.toUpperCase()
                    : piece.type
                  : null;
                return (
                  <ChessBoardBox
                    key={key}
                    color={color}
                    piece={piece}
                    pieceColor={pieceColor}
                    square={square}
                    possibleMoves={possibleMoves}
                    handleChessBoxClick={handleChessBoxClick}
                    pawnPieceDisplay={pawnPieceDisplay}
                    setPawnPieceDisplay={setPawnPieceDisplay}
                    setPawnPromotion={setPawnPromotion}
                    updatePieceNewLocation={updatePieceNewLocation}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <PlayerInfoInGame
          player={users.you || {}}
          isOnline={onlineUsers[users.you?._id]}
          opponentColor={users.opponent?.color}
          allMoves={moves}
          points={points}
          setPoints={setPoints}
        />
      </div>
    </div>
  );
}

export default ChessBoard;
