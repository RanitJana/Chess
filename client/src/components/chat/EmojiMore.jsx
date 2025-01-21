/* eslint-disable react/prop-types */
import React from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiMore = ({ onEmojiClick, isEmojiPickerTrue }) => (
  <div
    className={`w-full ${isEmojiPickerTrue ? "h-[17rem]" : "h-0"} transition-all `}
  >
    <EmojiPicker
      previewConfig={{ showPreview: false }}
      theme="dark"
      autoFocusSearch={false}
      emojiStyle="facebook"
      searchDisabled
      style={{
        height: "100%",
        width: "100%",
      }}
      lazyLoadEmojis={true}
      open={isEmojiPickerTrue}
      onEmojiClick={onEmojiClick}
    />
  </div>
);
const MemoizedEmojiMore = React.memo(EmojiMore);
export default MemoizedEmojiMore;
