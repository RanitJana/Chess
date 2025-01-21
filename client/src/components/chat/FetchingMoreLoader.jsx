/* eslint-disable react/prop-types */
function FetchingMoreLoader({ hasMoreMessages }) {
  if (!hasMoreMessages) return;
  return (
    <div className="flex items-center justify-center pb-3">
      <span
        className="loader"
        style={{
          width: "2rem",
          height: "2rem",
          borderWidth: "0.15rem",
        }}
      ></span>
    </div>
  );
}

export default FetchingMoreLoader;
