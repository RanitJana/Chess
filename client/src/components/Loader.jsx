import "./Loader.css";

function Loader() {
  return (
    <div className="fixed top-0 left-0  h-dvh w-dvw bg-[rgba(0,0,0,0.65)] z-[999] overflow-hidden flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}

export default Loader;
