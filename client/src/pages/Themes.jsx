import NavBar from "../components/NavBar.jsx";
import { themes, themeChessboardBoxColor } from "../constants.js";
import Toast from "../utils/Toast.js";

function Themes() {
  const handleChangeTheme = (theme) => {
    try {
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

        <div className="rounded-md bg-blackDark sm:p-4 p-2 py-4 flex flex-col gap-1">
          {Object.keys(themes).map((theme, idx) => {
            return (
              <div
                key={idx}
                className="px-4 py-2 relative overflow-hidden rounded-md font-semibold text-white hover:cursor-pointer hover:brightness-110 transition-all flex justify-between"
                onClick={() => handleChangeTheme(theme)}
                style={{
                  backgroundColor: themeChessboardBoxColor[theme].dark,
                }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.11)]"></div>
                <span className="z-10 capitalize">{theme}</span>
                <div className="grid grid-cols-2 grid-rows-2 w-[6rem] z-10 shadow-md">
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].light,
                    }}
                  >
                    <img src={`/images/themes/${theme}/bn.png`} alt="" />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].dark,
                    }}
                  >
                    <img src={`/images/themes/${theme}/wn.png`} alt="" />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].dark,
                    }}
                  >
                    <img src={`/images/themes/${theme}/bp.png`} alt="" />
                  </div>
                  <div
                    style={{
                      backgroundColor: themeChessboardBoxColor[theme].light,
                    }}
                  >
                    <img src={`/images/themes/${theme}/wp.png`} alt="" />
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
