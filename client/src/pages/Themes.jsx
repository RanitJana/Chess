import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import {
  themes,
  themeChessboardBoxColor,
  getThemeBackground,
} from "../constants.js";
import Toast from "../utils/Toast.js";

function Themes() {
  const [theme, setTheme] = useState(() => {
    const storeTheme = localStorage.getItem("chess-theme");
    return Object.keys(themes).sort((a, b) =>
      a === storeTheme ? -1 : b === storeTheme ? 1 : 0
    );
  });

  const handleChangeTheme = (theme) => {
    try {
      setTheme((prev) =>
        [...prev].sort((a, b) => (a === theme ? -1 : b === theme ? 1 : 0))
      );
      localStorage.setItem("chess-theme", theme);
      Toast.success("Theme changed");
    } catch {
      Toast.error("Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        <NavBar />
        <p className="flex items-center justify-start gap-2 sm:p-0 pl-4">
          <img
            src="/images/theme.png"
            alt=""
            className="w-6 brightness-0 invert"
          />
          <span className="font-bold text-white text-2xl">Board themes</span>
        </p>

        <div className="rounded-md bg-blackDark sm:p-4 p-2 py-4 grid sm:grid-cols-2 grid-cols-1 gap-1">
          {theme.map((theme, idx) => {
            return (
              <div
                key={idx}
                className="p-4 relative overflow-hidden rounded-md font-semibold text-white hover:cursor-pointer hover:brightness-110 transition-all flex justify-between"
                onClick={() => handleChangeTheme(theme)}
                style={{
                  background: `url(${getThemeBackground(theme)})  ${themeChessboardBoxColor[theme].light} center top / cover no-repeat`,
                }}
              >
                <span className="z-10 capitalize flex gap-2">
                  {idx == 0 ? (
                    <div className="bg-green-600 w-5 h-5 rounded-full p-1">
                      <img
                        src="/images/tick.png"
                        className="w-5 invert brightness-0"
                        alt=""
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  {theme}
                </span>
                <div className="grid grid-cols-2 grid-rows-2 w-[6.5rem] h-[6.5rem] z-10 shadow-md">
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].light,
                    }}
                  >
                    <img
                      src={`/images/themes/${themes[theme]}/bn.png`}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].dark,
                    }}
                  >
                    <img
                      src={`/images/themes/${themes[theme]}/wn.png`}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].dark,
                    }}
                  >
                    <img
                      src={`/images/themes/${themes[theme]}/bp.png`}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].light,
                    }}
                  >
                    <img
                      src={`/images/themes/${themes[theme]}/wp.png`}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Themes;
