/* eslint-disable react/prop-types */
import { useRef } from "react";

function SearchBar({ handleFunction }) {
  const debouncingRef = useRef(null);

  const handleOnChange = function (e) {
    clearTimeout(debouncingRef.current);
    debouncingRef.current = setTimeout(
      () => handleFunction(e.target.value),
      500
    );
  };

  return (
    <div className="relative flex w-full rounded-3xl overflow-hidden">
      <img
        src="/images/search.png"
        alt=""
        className="absolute left-3 top-1/2 translate-y-[-50%] w-5"
      />
      <input
        onChange={handleOnChange}
        type="text"
        name=""
        id=""
        className="w-full bg-[rgb(61,58,57)] text-white outline-none p-3 py-2 pl-11 rounded-sm"
        placeholder="Search by name"
      />
    </div>
  );
}

export default SearchBar;
