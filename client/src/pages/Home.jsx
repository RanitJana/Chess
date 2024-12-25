import { useState, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext.jsx";
import { gameInit } from "../api/game.js";
import { toast } from "react-hot-toast";
import CurrentGamePreview from "../components/CurrentGamePreview.jsx";
import CompletedGames from "../components/CompletedGames.jsx";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

function Home() {
  const { totalOnline } = useSocketContext();

  const { playerInfo } = useAuthContext();

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [addNewGame, setAddNewGame] = useState(null);
  // Create a new game
  const handleClick = useCallback(async () => {
    try {
      setIsCreatingGame(true);
      const response = await gameInit();
      const { success, info, message } = response?.data || {};
      if (success) {
        setAddNewGame(info);
        // setGames((prev) => [info, ...prev]);
        toast.success(message);
      } else {
        toast.error(message || "Failed to create a game.");
      }
    } catch (error) {
      console.error("Error creating a game:", error);
      toast.error("Something went wrong while creating a game.");
    } finally {
      setIsCreatingGame(false);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center h-fit sm:p-8 p-2 gap-10">
      {<NavBar />}
      {/* Header Section */}
      <div className="flex flex-wrap justify-center items-center gap-10">
        <div className="w-[min(28rem,100%)] aspect-square bg-[rgba(255,255,255,0.2)] overflow-hidden rounded-md">
          <img
            src="/images/standardboard.png"
            draggable={false}
            alt="Chess Board"
            className="w-[min(28rem,100%)] h-full"
          />
        </div>
        <div className="max-w-[30rem] flex flex-col items-center text-center">
          <h2 className="text-white font-extrabold md:text-[3.2rem] text-[2rem] leading-[3.5rem]">
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
          <button
            disabled={isCreatingGame}
            className={`bg-buttonLight ${isCreatingGame ? "opacity-50 cursor-not-allowed" : ""} w-full max-w-[25rem] rounded-lg h-12 p-4 py-3 hover:cursor-pointer min-h-fit flex justify-center items-center gap-5 font-extrabold text-[1.5rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] mt-4 }`}
            onClick={handleClick}
          >
            <img src="/images/play.svg" alt="Play Icon" className="w-[4rem]" />
            <div className="flex flex-col items-start">
              <span className="text-3xl">New Game</span>
            </div>
          </button>
        </div>
      </div>

      {/* Games Section */}
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
