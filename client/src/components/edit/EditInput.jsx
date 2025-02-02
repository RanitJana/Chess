/* eslint-disable react/prop-types */
import InputField from "../InputField.jsx";

function EditInput({
  value,
  type,
  placeholder,
  setInfo,
  infoName,
  imgPath,
  instruction,
}) {
  return (
    <div className="flex flex-col text-sm gap-1">
      <span className="text-white font-bold">{instruction}</span>
      <div className="relative">
        <img
          src={imgPath}
          alt=""
          className="absolute left-2 top-1/2 translate-y-[-50%] w-5"
        />
        <InputField
          value={value}
          type={type}
          placeholder={placeholder}
          setInfo={setInfo}
          infoName={infoName}
        />
      </div>
    </div>
  );
}

export default EditInput;
