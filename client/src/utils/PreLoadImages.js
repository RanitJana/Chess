const imageList = [
  "200.png",
  "double.png",
  "knight-w.png",
  "play.svg",
  "standardboard.png",
  "about.png",
  "edit.png",
  "lock.png",
  "queen-b.png",
  "sun.png",
  "accept.png",
  "exit.png",
  "message.png",
  "queen-w.png",
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
  "bishop-b.png",
  "friends.png",
  "nationality.png",
  "rook-b.png",
  "trophy.png",
  "bishop-w.png",
  "handshake.svg",
  "no-game.png",
  "rook-w.png",
  "unfriend.png",
  "challange.png",
  "Home.png",
  "nrking-b.png",
  "search.png",
  "user-pawn.gif",
  "chat.png",
  "icons8-closed-eye-100.png",
  "nrking-w.png",
  "send.png",
  "user.png",
  "chess.com.png",
  "icons8-eye-24.png",
  "online.png",
  "settings.png",
  "versus.png",
  "completed.png",
  "joined.png",
  "pawn-b.png",
  "smile.png",
  "win.gif",
  "cross.png",
  "knight-b.png",
  "pawn-w.png",
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
