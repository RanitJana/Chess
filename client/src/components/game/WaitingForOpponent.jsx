/* eslint-disable react/prop-types */
function WaitingForOpponent({ player }) {
  if (player) return;

  return (
    <div className="absolute inset-0 bg-black opacity-75 flex justify-center items-center">
      <p className="text-white font-semibold text-sm text-center">
        Waiting for an opponent...
      </p>
    </div>
  );
}

export default WaitingForOpponent;
