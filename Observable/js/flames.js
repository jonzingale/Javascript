{
  const perlin = new Noise(3);
  const context = DOM.context2d(width, height);
  context.canvas.style.background = "#000";
  context.lineWidth = 0.5;
  context.globalAlpha = 0.05;
  for (let px = 0; px < width; ++px) {
    for (let i = 0; i < height / 6; ++i) {
      let x = px;
      let y = Math.random() * height;
      let n = perlin.noise(x * period, y * period);
      context.strokeStyle = `hsl(${-210 + n * 600}, 100%, ${800 * n * n * n}%)`;
      context.beginPath();
      context.moveTo(x, y);
      for (let m = 0; m < length && y >= 0 && y <= height; ++m) {
        n = perlin.noise(x * period, y * period);
        context.lineTo(x += Math.cos(n * 14), y += Math.sin(n * 14));
      }
      context.stroke();
    }
    // yield context.canvas;
  }
}