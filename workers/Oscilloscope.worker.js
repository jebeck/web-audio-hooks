let bg = 'ghostwhite';
let stroke = 'black';
let canvas;
let ctx;

function draw(dataArray) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  const sliceWidth = (1.0 * canvas.width) / dataArray.length;
  let x = 0;
  for (var i = 0; i < dataArray.length; ++i) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function handleMessage({ data }) {
  if (data?.canvas) {
    canvas = data.canvas;
    ctx = data.canvas.getContext('2d');
  }
  if (data?.workerOptions) {
    const options = data.workerOptions;
    if (options?.bg) {
      bg = options.bg;
    }
    if (options?.stroke) {
      stroke = options.stroke;
    }
  }

  if (data?.timeDomainData) {
    const dataArray = new Uint8Array(data?.timeDomainData);
    draw(dataArray);
  }
}

onmessage = handleMessage;
