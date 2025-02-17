/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import ChessBoard from "../components/game/ChessBoard.jsx";
import { useParams } from "react-router";
import { gameSingle } from "../api/game.js";
import { socket } from "../socket.js";
import GameSideSection from "../components/game/GameSideSection.jsx";
import WinnerBoard from "../components/game/WinnerBoard.jsx";
import NavBar from "../components/NavBar.jsx";
import { colors, getScore, makeSound, winReason } from "../constants.js";
import Draw from "../components/draw/Draw.jsx";
import { getThemeColor } from "../constants.js";
import { Chess } from "chess.js";
import Toast from "../utils/Toast.js";

const GameContext = createContext();

function useGameContext() {
  return useContext(GameContext);
}

export { useGameContext };

export default function Game() {
  const { gameId } = useParams();
  const themeColor = getThemeColor();

  const [boardStates, setBoardStates] = useState({
    board: null,
    turn: null,
    castling: null,
    enPassant: null,
    move: {
      half: 0,
      full: 1,
    },
  });
  const [gameInfo, setGameInfo] = useState({});
  const [moves, setMoves] = useState([]);
  const [users, setusers] = useState({
    you: null,
    opponent: null,
  });
  const [rotateBoard, setRotateboard] = useState("rotate(0deg)");
  const [drawOpen, setDrawOpen] = useState(false);

  const [isCheckMate, setCheckMate] = useState(null);
  const [winnerReason, setWinnerReason] = useState(null);
  const [score, setScore] = useState(0);

  const [moveIndex, setMoveIndex] = useState(null);

  const drawTimeRef = useRef(null);

  useEffect(() => {
    const getGameInfo = async () => {
      try {
        const { data } = await gameSingle(gameId);
        if (data) {
          const { color, game } = data;

          if (color == colors.white)
            setusers({
              you: { ...game.player1, color },
              opponent: { ...game.player2, color: colors.black },
            });
          else {
            setusers({
              you: { ...game.player2, color: colors.black },
              opponent: game.player1,
              color,
            });
            setRotateboard("rotate(180deg)");
          }

          const boardInfo = game.board.split(" ");

          setBoardStates({
            board: new Chess(game.board),
            turn: boardInfo[1] == "w" ? colors.white : colors.black,
            castling: boardInfo[2],
            enPassant: boardInfo[3],
            move: {
              half: parseInt(boardInfo[4]),
              full: parseInt(boardInfo[5]),
            },
          });
          setGameInfo(game);
          setScore(game.score);
          setWinnerReason(game.winReason);
          setCheckMate(game.winner);
          setMoves(game.moves.map((move) => JSON.parse(move)));
          setMoveIndex(game.moves.length - 1);
        }
      } catch (error) {
        console.log(error);
        Toast.error("Unable to fetch games");
      }
    };
    getGameInfo();
  }, [gameId]);

  useEffect(() => {
    const handleOpponentMove = (info) => {
      const boardInfo = info.fen.split(" ");

      const newChess = new Chess(info.fen);

      setBoardStates({
        board: newChess,
        turn: boardInfo[1] == "w" ? colors.white : colors.black,
        castling: boardInfo[2],
        enPassant: boardInfo[3],
        move: {
          half: parseInt(boardInfo[4]),
          full: parseInt(boardInfo[5]),
        },
      });

      if (newChess.isCheckmate()) {
        setCheckMate(boardInfo[1] == "w" ? colors.black : colors.white);
        setWinnerReason(winReason.byCheckmate);
        const score = getScore(
          gameInfo.player1?.rating,
          gameInfo.player2?.rating,
          boardInfo[1] == "b"
        );
        setScore(score);
      }
      const lastMove = JSON.parse(info.lastMove);

      setMoves((prev) => [...prev, lastMove]);
      makeSound(lastMove);
    };

    socket.emit("join-game", gameId);
    socket.on("opponent-move", handleOpponentMove);
    return () => {
      socket.off("join-game");
      socket.off("opponent-move", handleOpponentMove);
    };
  }, [gameId, gameInfo.player1?.rating, gameInfo.player2?.rating]);

  useEffect(() => {
    const handleEndGame = (info) => {
      setCheckMate(info.winner);
      setWinnerReason(info.reason);
      setScore(info.score);
    };

    const handleDraw = (info) => {
      if (info.gameId == gameId) {
        setDrawOpen(true);
        if (drawTimeRef.current) clearTimeout(drawTimeRef.current);
        drawTimeRef.current = setTimeout(() => {
          setDrawOpen(false);
        }, 5000);
      }
    };
    const listeners = [
      ["accept-resign", handleEndGame],
      ["receive-draw-proposal", handleDraw],
      ["accept-draw", handleEndGame],
      ["show-draw", handleEndGame],
    ];
    listeners.forEach(([event, listener]) => socket.on(event, listener));
    return () => {
      listeners.forEach(([event, listener]) => socket.off(event, listener));
    };
  }, [gameId]);

  const handleSeePreviousState = useCallback(
    (moveIndex) => {
      setMoveIndex(moveIndex);
      const move = moveIndex === -1 ? moves[0] : moves[moveIndex];
      if (!move) return;
      const boardState = moveIndex === -1 ? moves[0].before : move.after;

      if (moveIndex != -1) makeSound(moves[moveIndex]);
      const boardInfo = boardState.split(" ");

      setBoardStates({
        board: new Chess(boardState), // Creates a fresh instance
        turn: boardInfo[1] === "w" ? colors.white : colors.black,
        castling: boardInfo[2],
        enPassant: boardInfo[3],
        move: {
          half: parseInt(boardInfo[4]),
          full: parseInt(boardInfo[5]),
        },
      });
    },
    [moves]
  );

  return (
    <GameContext.Provider
      value={{
        gameId,
        boardStates,
        setBoardStates,
        gameInfo,
        users,
        moves,
        setMoves,
        themeColor,
        rotateBoard,
        isCheckMate,
        setCheckMate,
        setWinnerReason,
        setScore,
        setMoveIndex,
        moveIndex,
        handleSeePreviousState,
      }}
    >
      <div className="relative w-full h-dvh overflow-scroll flex flex-col gap-4">
        <WinnerBoard winnerReason={winnerReason} score={score} />
        <Draw
          isOpen={drawOpen}
          setOpen={setDrawOpen}
          opponent={users.opponent || {}}
        />
        <div className="sm:p-4 p-0 w-full flex justify-center items-center">
          <NavBar />
        </div>
        <div className=" flex w-full justify-center items-center">
          <div className="grid grid-cols-1 w-full h-full gap-2 md:grid-cols-2 max-w-[970px]">
            <ChessBoard />
            <GameSideSection />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
