let fontSize = 2;

function changeFontSize(event) {
  if (event.altKey) {
    if (event.key === '+' || event.key === '=') {
      fontSize++;
    } else if (event.key === '-') {
      fontSize = Math.max(1, fontSize - 1);
    }
    document.documentElement.style.setProperty('--size', fontSize);
  }
}

document.addEventListener('keydown', changeFontSize);
