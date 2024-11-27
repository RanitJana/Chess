const moveSound = function () {
  const audio = new Audio("/audios/move-self.mp3");
  audio.play();
};

const captureSound = function () {
  const audio = new Audio("/audios/capture.mp3");
  audio.play();
};

const checkSound = function () {
  const audio = new Audio("/audios/move-check.mp3");
  audio.play();
};

export { moveSound, captureSound, checkSound };
