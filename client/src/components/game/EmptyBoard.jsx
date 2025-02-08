import { getThemeColor } from "../../constants.js";

function EmptyBoard() {
  let board = Array(8)
    .fill()
    .map(() => Array(8).fill(" "));
  return board.map((row, rowIdx) => {
    const themeColor = getThemeColor();
    return (
      <div className="grid grid-cols-8 w-full" key={rowIdx}>
        {row.map((_, colIdx) => {
          const color =
            (colIdx + rowIdx) & 1 ? themeColor.dark : themeColor.light;
          return (
            <div
              key={rowIdx + colIdx}
              style={{ backgroundColor: color }}
              className=" aspect-square"
            ></div>
          );
        })}
      </div>
    );
  });
}

export default EmptyBoard;
