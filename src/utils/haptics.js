export function hapticLight() {
  if (navigator.vibrate) navigator.vibrate(10);
}

export function hapticMedium() {
  if (navigator.vibrate) navigator.vibrate(25);
}

export function hapticSuccess() {
  if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
}

export function hapticError() {
  if (navigator.vibrate) navigator.vibrate([30, 20, 30, 20, 30]);
}
