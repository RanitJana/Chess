/* eslint-disable react/prop-types */
import { countries } from "country-flag-icons";
import { useState } from "react";
import SearchBar from "../SearchBar.jsx";
import getCountryNameFlag from "../../utils/getCountryNameFlag.js";

function CountryList({ setIsMapOpen, setUserInfo }) {
  const [allCountry, setAllCountry] = useState(countries || []);

  const handleSearch = (name) => {
    setAllCountry(() =>
      countries.filter((country) =>
        getCountryNameFlag(country)
          .name.toLocaleLowerCase()
          .startsWith(name.toLocaleLowerCase())
      )
    );
  };

  return (
    <div className="fixed top-0 left-0 w-dvw bg-[rgba(0,0,0,0.2)] h-[100dvh] overflow-y-auto z-[9999]">
      <div className="absolute overflow-hidden top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] sm:h-[80%] sm:w-[30rem] h-full w-full rounded-lg p-4 bg-blackDarkest shadow-lg flex flex-col gap-2">
        <div className="flex gap-2">
          <SearchBar handleFunction={handleSearch} />
          <button
            className={`bg-red-500 hover:bg-red-600 transition-colors rounded-md w-[5rem] flex justify-center items-center`}
            onClick={() => setIsMapOpen(false)}
          >
            <img
              src="/images/cross.png"
              alt=""
              className="invert brightness-0 w-6"
            />
          </button>
        </div>
        <ul className="h-full overflow-y-scroll space-y-2">
          {allCountry?.map((country, index) => {
            const info = getCountryNameFlag(country);
            return (
              <li
                key={index}
                onClick={() => {
                  setUserInfo((prev) => ({ ...prev, nationality: country }));
                  setIsMapOpen(false);
                }}
                className="flex items-center gap-3 p-2 bg-blackDark rounded-md hover:cursor-pointer hover:bg-blackLight transition-all"
              >
                <img className="w-8" alt={info.name} src={info.link} />
                <span className="text-white text-sm font-bold">
                  {info.name}
                </span>
              </li>
            );
          })}
          {allCountry.length == 0 && (
            <div className="text-white text-center mt-5">
              No result is found
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CountryList;
