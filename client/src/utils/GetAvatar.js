import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

export default function GetAvatar(seed = "Guest") {
  const avatar = createAvatar(funEmoji, {
    seed,
    // ... other options
  });
  return avatar.toString();
}
