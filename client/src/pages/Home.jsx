import { useState, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext.jsx";
import { gameInit } from "../api/game.js";
import CurrentGamePreview from "../components/game/CurrentGamePreview.jsx";
import CompletedGames from "../components/game/CompletedGames.jsx";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Toast from "../utils/Toast.js";
import ChallangesHome from "../components/game/ChallangesHome.jsx";
import ChallangeFriends from "../components/home/ChallangeFriends.jsx";

function Home() {
  const { totalOnline } = useSocketContext();

  const { playerInfo } = useAuthContext();

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [addNewGame, setAddNewGame] = useState(null);
  const [games, setGames] = useState([]);
  // Create a new game
  const handleClick = useCallback(async () => {
    try {
      setIsCreatingGame(true);
      const response = await gameInit();
      const { success, info, message } = response?.data || {};
      if (success) {
        setAddNewGame(info);
        Toast.success(message);
      } else {
        Toast.error(message || "Failed to create a game");
      }
    } catch (error) {
      console.error("Error creating a game:", error);
      Toast.error("Something went wrong while creating a game");
    } finally {
      setIsCreatingGame(false);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center h-fit sm:p-8 p-0 gap-5">
      {<NavBar />}
      {isOpen && <ChallangeFriends setOpen={setOpen} setGames={setGames} />}
      {/* Header Section */}
      <div className="flex w-full lg-930:flex-row max-w-[970px] flex-col justify-center items-center gap-10 sm:p-0 p-2">
        <div className="w-[min(28rem,100%)] aspect-square bg-[rgba(255,255,255,0.2)] overflow-hidden rounded-md">
          {/* <img
            src="/images/standardboard.png"
            draggable={false}
            alt="Chess Board"
            className="w-[min(28rem,100%)] h-full"
          /> */}
          <video
            src="/videos/chess.mp4"
            autoPlay
            loop
            muted
            autoFocus
            className="w-full h-full object-cover"
          ></video>
        </div>
        <div className="max-w-[30rem] flex flex-col items-center text-center pb-5">
          <h2 className="text-white font-extrabold md:text-[3.2rem] md:mt-0 mt-[-1rem] text-[2rem] md:leading-[3.5rem] leading-[2rem]">
            Play Chess Online on the #2 Site!
          </h2>
          <div className="flex sm:flex-row flex-col gap-1 justify-between w-full px-10 my-5 items-center">
            <div>
              <span className="text-white font-bold">15,145,763</span>
              <span className="pl-1 text-gray-400 font-bold">Games Today</span>
            </div>
            <div>
              <span className="text-white font-bold">{totalOnline}</span>
              <span className="pl-1 text-gray-400 font-bold">Playing Now</span>
            </div>
          </div>
          <div className="w-full flex flex-wrap gap-3 justify-center items-center">
            <button
              disabled={isCreatingGame}
              className={`bg-blackDark ${isCreatingGame ? "brightness-50 cursor-not-allowed" : ""} w-full max-w-[25rem] rounded-lg h-[4rem] p-4 py-3 hover:bg-blackDarkest transition-colors hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.5rem] text-white shadow-[0_5px_0px_0px_rgb(29,28,26)] }`}
              onClick={handleClick}
            >
              <img
                src="/images/play.svg"
                alt="Play Icon"
                className="w-[3rem]"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl">New Game</span>
              </div>
            </button>
            <button
              disabled={isCreatingGame}
              className={`bg-blackDark w-full max-w-[25rem] rounded-lg h-[4rem] p-4 py-3 hover:bg-blackDarkest transition-colors hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.5rem] text-white shadow-[0_5px_0px_0px_rgb(29,28,26)] }`}
              onClick={() => setOpen(true)}
            >
              <img
                src="/images/handshake.svg"
                alt="Play Icon"
                className="w-[3rem]"
              />
              <div className="flex flex-col items-start">
                <span className="text-xl">Play a friend</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Games Section */}
      {
        <ChallangesHome
          setAddNewGame={setAddNewGame}
          games={games}
          setGames={setGames}
        />
      }
      <CurrentGamePreview
        userId={playerInfo?._id}
        addNewGame={addNewGame}
        setAddNewGame={setAddNewGame}
      />
      <CompletedGames userId={playerInfo?._id} />
    </div>
  );
}

export default Home;
