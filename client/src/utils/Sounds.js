const moveAudio = new Audio("/audios/move-self.mp3");
const captureAudio = new Audio("/audios/capture.mp3");
const checkAudio = new Audio("/audios/move-check.mp3");
const checkMateAudio = new Audio("/audios/game-end.mp3");

const moveSound = async () => await moveAudio.play();
const captureSound = async () => await captureAudio.play();
const checkSound = async () => await checkAudio.play();
const checkMateSound = async () => await checkMateAudio.play();

export { moveSound, captureSound, checkSound, checkMateSound };
