import GetAvatar from "../../utils/GetAvatar.js";

function SingleFriendSkeleton() {
  return (
    <div className="w-fit hover:cursor-pointer max-w-[5rem] overflow-hidden">
      <div className="relative">
        <div className="h-[4rem] flex justify-center items-center sm:w-fit left-1/2 rounded-sm overflow-hidden aspect-square">
          <div className="relative w-full rounded-2xl overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: GetAvatar("") }} />
          </div>
        </div>
        {
          <div className="absolute right-0 translate-x-[-50%] bottom-0 w-5 aspect-square rounded-full bg-green-600"></div>
        }
      </div>
      <div className="text-white font-semibold text-sm text-wrap line-clamp-1 overflow-hidden w-full">
        <span>Loading...</span>
        <span className="text-gray-500"> (200)</span>
      </div>
    </div>
  );
}

export default SingleFriendSkeleton;
