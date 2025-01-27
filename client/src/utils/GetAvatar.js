import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

export default function GetAvatar(seed = "Guest") {
  const avatar = createAvatar(funEmoji, {
    seed,
    // ... other options
    backgroundType: ["solid"],
    eyes: ["cute", "shades", "wink", "wink2"],
    mouth: ["faceMask", "lilSmile", "smileTeeth", "tongueOut"],
  });
  return avatar.toString();
}
