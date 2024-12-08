function EmptyBoard() {
  let board = Array(8)
    .fill()
    .map(() => Array(8).fill(" "));
  return board.map((row, rowIdx) => {
    return (
      <div className="grid grid-cols-8 w-full" key={rowIdx}>
        {row.map((_, colIdx) => {
          const color =
            (colIdx + rowIdx) % 2 === 0
              ? "rgb(234,237,208)"
              : "rgb(115,149,82)";
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
