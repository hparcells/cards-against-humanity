function playSound(name) {
  const sound = require(`./../res/audio/${name}.wav`);
  const audio = new Audio(sound);
  audio.play();
}

export default playSound;
