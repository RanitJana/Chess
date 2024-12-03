/* eslint-disable react/prop-types */
function Button({ isSubmit = true, value = "Click" }) {
  return (
    <button
      type="submit"
      disabled={isSubmit}
      className={`bg-buttonLight rounded-lg h-12 font-extrabold text-[1.5rem] text-white shadow-[0_5px_0px_0px_rgb(69,116,61)] ${isSubmit && "opacity-50 cursor-not-allowed"}`}
    >
      {value}
    </button>
  );
}

export default Button;
