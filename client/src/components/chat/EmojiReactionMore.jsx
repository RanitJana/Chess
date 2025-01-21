/* eslint-disable react/prop-types */
import React from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerComponentForReaction = ({
  onEmojiClick,
  isOpenReactionMore,
  setTrueFalseStates,
}) => (
  <div className="w-full">
    <div className="flex justify-center items-center w-full p-2">
      <div
        className="bg-gray-900 transition-colors rounded-full p-1 hover:bg-gray-800 hover:cursor-pointer"
        onClick={() =>
          setTrueFalseStates((prev) => ({ ...prev, isOpenReactionMore: false }))
        }
      >
        <img src="/images/cross.png" alt="X" className="w-7" />
      </div>
    </div>
    <div className="bg-gray-800 h-full">
      <EmojiPicker
        emojiStyle="facebook"
        previewConfig={{ showPreview: false }}
        theme="dark"
        autoFocusSearch={false}
        searchDisabled={true}
        skinTonesDisabled={true}
        open={isOpenReactionMore}
        style={{
          position: "absolute",
          height: "90%",
          width: "100%",
        }}
        lazyLoadEmojis={true}
        onEmojiClick={onEmojiClick}
      />
    </div>
  </div>
);

const MemoizedEmojiPickerForReaction = React.memo(
  EmojiPickerComponentForReaction
);

export default MemoizedEmojiPickerForReaction;
