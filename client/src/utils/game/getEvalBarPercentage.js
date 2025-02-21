const getEvalBarPercentage = (evalScore, isWhiteToMove) => {
  // console.log(evalScore);

  if (typeof evalScore === "string" && evalScore.includes("Mate")) {
    const mateInMoves = parseInt(evalScore.match(/-?\d+/)[0], 10);

    if (mateInMoves > 0) {
      return isWhiteToMove ? 100 : 0; // White to move → White wins → 100%. Black to move → Black wins → 0%.
    } else {
      return isWhiteToMove ? 0 : 100; // White to move → White gets mated → 0%. Black to move → Black gets mated → 100%.
    }
  }

  const maxEval = 10; // Cap at ±10 pawns for better scaling
  let normalized = Math.max(-maxEval, Math.min(maxEval, evalScore));

  // Sigmoid-like transformation for better scaling
  const percentage = 50 + (50 * Math.atan(normalized) * 2) / Math.PI;

  return Math.round(percentage);
};

export default getEvalBarPercentage;
