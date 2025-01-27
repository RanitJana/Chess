function SingleFriendSkeleton() {
  return (
    <div className="w-fit hover:cursor-pointer max-w-[5rem] overflow-hidden flex flex-col items-center">
      <div className="relative mb-1">
        <div className="h-[4rem] bg-gray-500 rounded-2xl flex justify-center items-center sm:w-fit left-1/2 overflow-hidden aspect-square"></div>
      </div>
      <div className="overflow-hidden w-[4.36rem] bg-gray-500 h-4 rounded-md"></div>
    </div>
  );
}

export default SingleFriendSkeleton;
