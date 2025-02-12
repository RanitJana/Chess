/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import { useNavigate, useSearchParams } from "react-router";
import Toast from "../utils/Toast.js";
import SearchBar from "../components/SearchBar.jsx";
import GetAvatar from "../utils/GetAvatar.js";
import getCountryNameFlag from "../utils/getCountryNameFlag.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { handleRank } from "../api/rank.js";

function Friends() {
  const { playerInfo } = useAuthContext();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [pages, setPages] = useState(1);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGetRank = async () => {
      try {
        setIsLoading(true);
        const { success, message, info } = (
          await handleRank(params.get("page") || 1, params.get("count") || 10)
        ).data;

        if (success) {
          setUsers(info.users);
          setPages(Math.ceil(info.total / (params.get("count") || 10))); // Fix pages calculation
        } else {
          Toast.error(message);
        }
      } catch (error) {
        console.log(error);
        Toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    handleGetRank();
  }, [params]);

  const handleNextPage = () => {
    const currentPage = parseInt(params.get("page")) || 1;
    if (currentPage < pages) {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", currentPage + 1);
        return newParams;
      });
    }
  };

  const handlePrevPage = () => {
    const currentPage = parseInt(params.get("page")) || 1;
    if (currentPage > 1) {
      setParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", currentPage - 1);
        return newParams;
      });
    }
  };

  const handleSearch = (text) => {
    // if (!friends) return;
    // setFriends((prev) => {
    //   return [...prev].sort((a, b) => {
    //     const infoA =
    //       a.receiver._id.toString() === userId ? a.sender : a.receiver;
    //     const infoB =
    //       b.receiver._id.toString() === userId ? b.sender : b.receiver;
    //     const aStartsWith = infoA.name
    //       .toLowerCase()
    //       .startsWith(text.toLowerCase());
    //     const bStartsWith = infoB.name
    //       .toLowerCase()
    //       .startsWith(text.toLowerCase());
    //     if (aStartsWith && !bStartsWith) return -1; // `a` comes first
    //     if (!aStartsWith && bStartsWith) return 1; // `b` comes first
    //     return 0; // Keep the same order otherwise
    //   });
    // });
  };

  return (
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        <NavBar />
        <p className="flex items-center justify-start gap-2 sm:p-0 pl-4">
          <img src="/images/ranking.png" alt="" className="w-8" />
          <span className="font-bold text-white text-2xl">Ranking</span>
        </p>
        <div className="rounded-md bg-blackDark sm:p-4 p-2 py-4 flex flex-col gap-6 sm:pt-10 pt-10">
          {/* search bar */}
          <SearchBar handleFunction={handleSearch} />
          <div className="overflow-x-scroll">
            <table className="w-full min-w-[30rem] table-auto text-gray-300 h-fit bg-gray-700">
              <thead className="bg-[rgb(27,27,27)] text-sm">
                <tr>
                  <th>Rank</th>
                  <th className="text-left py-3">Player</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody className="border-separate font-bold text-white">
                {users.map((user, idx) => {
                  const flag = getCountryNameFlag(user.nationality);
                  const rank =
                    params.get("count") * (params.get("page") - 1) + (idx + 1);
                  const backgroundColor =
                    rank == 1
                      ? "rgb(255, 215, 0)"
                      : rank == 2
                        ? "rgb(192, 192, 192)"
                        : rank == 3
                          ? "rgb(205, 127, 50)"
                          : "transparent";
                  return (
                    <tr
                      key={user._id}
                      className={`text-center text-sm hover:bg-[rgba(27,27,27,0.27)] bg-blackDark transition-colors odd:bg-blackLight`}
                      style={{
                        backgroundColor:
                          user._id == playerInfo?._id
                            ? "rgba(27,27,27,0.6)"
                            : "",
                      }}
                    >
                      <td className="text-sm">
                        <span
                          className="p-2 rounded-md"
                          style={{ backgroundColor }}
                        >
                          #{rank}
                        </span>
                      </td>
                      <td className="flex gap-1 h-full items-center py-3">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: GetAvatar(user.name),
                          }}
                          onClick={() => navigate("/member/" + user._id)}
                          className="relative w-[2.8rem] mr-2 rounded-md overflow-hidden hover:cursor-pointer"
                        />
                        <span
                          className="hover:cursor-pointer"
                          onClick={() => navigate("/member/" + user._id)}
                        >
                          {user.name}
                        </span>
                        <img
                          src={flag.link}
                          alt=""
                          title={flag.name}
                          className="w-8"
                        />
                      </td>
                      <td>{user.rating}</td>
                    </tr>
                  );
                })}
                {users.length == 0 && (
                  <tr className="text-center text-xs font-normal bg-blackDarkest">
                    <td colSpan={3} className="py-3">
                      <span> No record is found</span>
                    </td>
                  </tr>
                )}
                {isLoading && (
                  <tr className="text-center bg-blackDarkest">
                    <td colSpan={3} className="py-3">
                      <span
                        className="loader"
                        style={{
                          width: "2.3rem",
                          borderWidth: "3px",
                          height: "2.3rem",
                        }}
                      ></span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <div className="flex justify-between items-center text-sm mt-4">
              <button
                onClick={handlePrevPage}
                disabled={parseInt(params.get("page")) <= 1}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-white">
                Page {params.get("page") || 1} of {pages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={parseInt(params.get("page")) >= pages}
                className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;
