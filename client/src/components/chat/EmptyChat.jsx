/* eslint-disable react/prop-types */
function EmptyChat({ length = 0 }) {
  return (
    <>
      {length == 0 ? (
        <div className="flex justify-center p-4">
          <p className="max-w-[80%] w-full bg-black rounded-lg p-2 text-center text-pretty text-[0.8rem]">
            <img
              src="/images/lock.png"
              alt=""
              className="w-3 aspect-square inline mr-1 mt-[-3px]"
            />
            Messages are partially encrypted. No one outside of this chat,
            (except chess2.com), can read them.
          </p>
        </div>
      ) : (
        <div className="bg-transparent h-5"></div>
      )}
    </>
  );
}

export default EmptyChat;
