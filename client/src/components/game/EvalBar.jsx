import { useState, useEffect, useRef } from "react";
import getEvalBarPercentage from "../../utils/game/getEvalBarPercentage.js";
import { useGameContext } from "../../pages/Game.jsx";

const getEvaluationFromFEN = (fen, callback) => {
  const engine = new Worker("/stockfish.js");

  engine.onmessage = (event) => {
    if (event.data.startsWith("info depth")) {
      const match = event.data.match(/score (cp|mate) (-?\d+)/);
      if (match) {
        let evalScore;
        if (match[1] === "cp") {
          evalScore = parseInt(match[2], 10) / 100; // Convert centipawns to pawn units
        } else {
          evalScore =
            match[2] > 0 ? "Mate in " + match[2] : "Mated in " + -match[2];
        }
        callback(evalScore);
        engine.terminate();
      }
    }
  };

  engine.postMessage("uci");
  setTimeout(() => {
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage("go depth 15"); // Adjust depth as needed
  }, 500);
};

function EvalBar() {
  const { boardStates, moves } = useGameContext();
  const [evaluation, setEvaluation] = useState(50); // Start at neutral
  const timeRef = useRef(null);
  useEffect(() => {
    const fen = boardStates.board?.fen();
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(
      getEvaluationFromFEN(fen, (evalScore) => {
        const evalPercentage = getEvalBarPercentage(
          evalScore,
          fen?.split(" ")[1] === "w"
        );
        setEvaluation(evalPercentage);
      }),
      500
    );
  }, [boardStates.board, moves]);
  return (
    <div className="w-3 h-full bg-gray-700 relative rounded-sm overflow-hidden">
      <div
        className="absolute bottom-0 w-full bg-white"
        style={{
          transition: "height 0.3s ease",
          height: `${evaluation}%`,
        }}
      />
    </div>
  );
}

export default EvalBar;
