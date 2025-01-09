/* eslint-disable react/prop-types */
function InputField({ value, type, placeholder, setInfo, infoName }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) =>
        setInfo((prev) => ({ ...prev, [infoName]: e.target.value }))
      }
      className="bg-blackLight hover:border-gray-400 focus:border-gray-400 p-2 outline-none border-[1px] border-gray-700 text-white pl-9 w-full rounded-2xl"
    />
  );
}

export default InputField;
