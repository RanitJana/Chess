const imageList = [
  "200.png",
  "double.png",
  "play.svg",
  "standardboard.png",
  "about.png",
  "edit.png",
  "lock.png",
  "sun.png",
  "accept.png",
  "exit.png",
  "message.png",
  "tick.png",
  "add-user.png",
  "favicon.png",
  "more.png",
  "reject.png",
  "tile.png",
  "arrow.png",
  "followers.png",
  "name.png",
  "reply.png",
  "time.gif",
  "friends.png",
  "nationality.png",
  "trophy.png",
  "handshake.svg",
  "no-game.png",
  "unfriend.png",
  "challange.png",
  "Home.png",
  "search.png",
  "user-pawn.gif",
  "chat.png",
  "icons8-closed-eye-100.png",
  "send.png",
  "user.png",
  "chess.com.png",
  "icons8-eye-24.png",
  "online.png",
  "settings.png",
  "versus.png",
  "completed.png",
  "joined.png",
  "smile.png",
  "win.gif",
  "cross.png",
  "smile-reaction.png",
];

const preloadImages = async () => {
  await Promise.all(
    imageList.map(async (url) => {
      const fullUrl = "/images/" + url;
      const cacheKey = `img_${url}`;

      // Check if already cached
      if (!localStorage.getItem(cacheKey)) {
        try {
          const response = await fetch(fullUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = function () {
            localStorage.setItem(cacheKey, reader.result);
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          console.error(`Failed to preload ${url}`, error);
        }
      }
    })
  );

  console.log("✅ All images preloaded and stored in cache!");
};

// Call this function on page load
document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
});

export default preloadImages;
