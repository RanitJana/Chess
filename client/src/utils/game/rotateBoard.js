function rotateSquare(square) {
  const files = "abcdefgh";
  const ranks = "12345678";

  // Get original file and rank from the square string (e.g., 'a7')
  const originalFile = square[0]; // 'a'
  const originalRank = square[1]; // '7'

  // Calculate new file and rank
  const newFile = files[files.length - 1 - files.indexOf(originalFile)]; // 'h'
  const newRank = ranks[ranks.length - 1 - ranks.indexOf(originalRank)]; // '2'

  return newFile + newRank;
}

export default rotateSquare;
