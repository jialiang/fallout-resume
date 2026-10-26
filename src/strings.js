export const textColors = ["Lime", "Cyan", "Orange", "White"];

export const radioStates = { true: "Enabled", false: "Disabled" };

export const holotapeMessages = {
  ready: "To start: Tap game or TAB to focus then SPACE",
  running: "SPACE, UP or tap to jump, DOWN to duck",
  paused: "Paused. To resume: Tap game or TAB to focus then SPACE",
  crashed: (score) => `Game over at ${score} points. Press SPACE or tap to retry`,
};
