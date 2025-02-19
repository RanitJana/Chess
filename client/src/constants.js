import { Chess } from "chess.js";
import {
  moveSound,
  captureSound,
  checkSound,
  checkMateSound,
} from "./utils/Sounds.js";

const colors = Object.freeze({
  white: "white",
  black: "black",
});

const winner = Object.freeze({
  white: colors.white,
  black: colors.black,
  draw: "draw",
});

const winReason = Object.freeze({
  byCheckmate: "by checkmate",
  byDraw: "by draw",
  byWhiteResigns: "by white resigns",
  byBlackResigns: "by black resigns",
  byStalemate: "by stalemate",
  byInsufficientMaterial: "by insufficient material",
  byThreefoldRepetition: "by threefold repetition",
});

const soundType = Object.freeze({
  capture: "capture",
  move: "move",
  check: "check",
  checkMate: "checkMate",
});

const getScore = function (whiteRating, blackRating, result) {
  const K = 20; // Common K-factor, adjust as needed

  // Expected scores using the Elo formula
  const expectedWhite =
    1 / (1 + Math.pow(10, (blackRating - whiteRating) / 400));
  const expectedBlack = 1 - expectedWhite;

  // Adjustments based on result (1 = White wins, 0.5 = Draw, 0 = Black wins)
  const whiteChange = parseFloat((K * (result - expectedWhite)).toFixed(1));
  const blackChange = parseFloat((K * (1 - result - expectedBlack)).toFixed(1));

  return { white: whiteChange, black: blackChange };
};

const makeSound = (move) => {
  const chess = new Chess(move.after);
  let sound;
  if (chess.isCheckmate()) sound = soundType.checkMate;
  else if (chess?.isCheck()) sound = soundType.check;
  else if (move?.captured) sound = soundType.capture;
  else sound = soundType.move;

  switch (sound) {
    case soundType.move:
      moveSound();
      break;
    case soundType.capture:
      captureSound();
      break;
    case soundType.check:
      checkSound();
      break;
    case soundType.checkMate:
      checkMateSound();
  }
};

const themes = {
  classic: "classic",
  newspaper: "newspaper",
  checkers: "checkers",
  icy: "icy",
  bases: "icy", //images are same
  real: "real",
  graffiti: "graffiti",
  glass: "glass",
  light: "light",
  tournament: "tournament",
};

const getPieceImagePath = (piece) => {
  const theme = localStorage.getItem("chess-theme") || themes.classic;
  const pieceMapping = {
    r: `/images/themes/${themes[theme]}/br.png`,
    p: `/images/themes/${themes[theme]}/bp.png`,
    n: `/images/themes/${themes[theme]}/bn.png`,
    b: `/images/themes/${themes[theme]}/bb.png`,
    q: `/images/themes/${themes[theme]}/bq.png`,
    k: `/images/themes/${themes[theme]}/bk.png`,
    R: `/images/themes/${themes[theme]}/wr.png`,
    P: `/images/themes/${themes[theme]}/wp.png`,
    N: `/images/themes/${themes[theme]}/wn.png`,
    B: `/images/themes/${themes[theme]}/wb.png`,
    Q: `/images/themes/${themes[theme]}/wq.png`,
    K: `/images/themes/${themes[theme]}/wk.png`,
  };
  return pieceMapping[piece] || "";
};

const getThemeBackground = (theme) => {
  return `/images/themes/${themes[theme]}/${theme}.png`;
};

const themeChessboardBoxColor = {
  [themes.classic]: {
    dark: "rgb(115,149,82)",
    light: "rgb(234,237,208)",
  },
  [themes.newspaper]: {
    dark: "rgb(90,90,90)",
    light: "rgb(206,204,197)",
  },
  [themes.checkers]: {
    dark: "rgb(49,49,48)",
    light: "rgb(199,77,80)",
  },
  [themes.icy]: {
    dark: "rgb(126,160,180)",
    light: "rgb(215,225,231)",
  },
  [themes.real]: {
    dark: "rgb(145,87,51)",
    light: "rgb(244,213,174)",
  },
  [themes.graffiti]: {
    dark: "rgb(167,132,95)",
    light: "rgb(173,173,172)",
  },
  [themes.glass]: {
    dark: "rgb(34,43,54)",
    light: "rgb(98,113,129)",
  },
  [themes.light]: {
    dark: "rgb(169,169,169)",
    light: "rgb(217,216,216)",
  },
  bases: {
    dark: "rgb(181,94,46)",
    light: "rgb(238,203,161)",
  },
  [themes.tournament]: {
    dark: "rgb(48,100,73)",
    light: "rgb(234,235,231)",
  },
};

const getThemeColor = () => {
  const theme = localStorage.getItem("chess-theme") || themes.classic;
  return themeChessboardBoxColor[theme];
};

const movingPieceTime = 100; //ms

export {
  colors,
  winner,
  winReason,
  soundType,
  makeSound,
  getPieceImagePath,
  movingPieceTime,
  getThemeColor,
  getScore,
  themes,
  themeChessboardBoxColor,
  getThemeBackground,
};
