export default function gameFactory(canvasSize, root, messages = {}, options = {}) {
  const PIXI = require('pixi.js');

  const config = {
    width: canvasSize,
    height: canvasSize,
    backgroundColor: 0xffffff,
    antialias: true,
    // resolution: window.devicePixelRatio || 1,
  }

  const app = new PIXI.Application(config);
  app.stage.interactive = true;

  root.appendChild(app.view);

  let boardSize = Math.floor(canvasSize * 0.85);
  const uiHeigth = canvasSize - boardSize;
  const delay = options['delay'] || 1.0;
  const boardFill = options['boardFill'] || 50;
  const step = Math.floor(boardSize/9);;
  const marging = 10;
  boardSize = step * 9;

  const boardContainer = new PIXI.Container();
  const uiConntainer = new PIXI.Container();
  app.stage.addChild(boardContainer);
  app.stage.addChild(uiConntainer);

  const msgSolve = messages['Solve'] || 'Solve';
  const msgPause = messages['Pause'] || 'Pause';
  const msgShuffle = messages['Shuffle'] || 'Shuffle';

  const sm = canvasSize <= 400;

  const cellTextStyle = {fontFamily : 'Roboto', fontSize: sm ? 16: 24, fill : 0x000000, align : 'center'};
  const btnTextStyle = {fontFamily : 'Roboto', fontSize: sm ? 16: 24, fill : 0x000000, align : 'center'};

  let board = [];
  let solution = [];
  let solverRunning = false;
  let pointer = 0;
  let frameTime = 0;
  let backtracking = false;
  let positions = [];
  let btnStartStop = null;
  let btnSuffle = null;

  class Pem extends PIXI.Graphics {
    drawLine(x0, y0, x1, y1) {
      this.moveTo(x0, y0);
      this.lineTo(x1, y1);
    }
  }

  function generateBoard() {
    let base = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let values = []
    while (base.length) {
      let index = Math.floor(Math.random() * base.length)
      values.push(base[index])
      base = [...base.slice(0, index), ...base.slice(index + 1, base.length)]
    }

    board = [[...values]]
    for (let line = 1; line < 9; line++) {
      let shifts = line % 3 === 0 ? 1 : 3
      let l = values.length
      values = [...values.slice(l - shifts, l), ...values.slice(0, l - shifts)]
      board.push(values)
    }

    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (Math.floor(Math.random() * 100) >= boardFill) {
          board[y][x] = 0
        }
      }
    }
    solution = board.map(item => [...item])
  }

  function doneSolving() {
    return pointer >= 9 ** 2
  }

  function isEditable(x, y) {
    const bb = board[y][x];
    const game_bounds = (x < 9 && y < 9);
    const fixed = (bb === 0);
    const solution_bound = (solution[y][x] <= 9);
    return game_bounds && fixed && solution_bound;
  }

  function isValid(x, y, value) {
    if (value < 1 || value > 9) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (i !== x && solution[y][i] === value) {
        return false;
      }
      if (i !== y && solution[i][x] === value) {
        return false;
      }
    }

    const sx = Math.floor(x / 3) * 3;
    const sy = Math.floor(y / 3) * 3;

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (i !== y && j !== x && solution[sy + i][sx + j] === value) {
          return false;
        }
    return true;
  }

  function nextValidValue(x, y) {
    let value = solution[y][x]
    do {
      if (isValid(x, y, ++value)) {
        return value;
      }
    } while (value <= 9);
    return 0;
  }

  function iterate() {
    const [py, px] = pointerData(pointer);
    if (isEditable(px, py)) {
      const next_val = nextValidValue(px, py);
      if (next_val === 0) {
        backtracking = true;
        pointer--;
      } else {
        backtracking = false;
        pointer++;
      }
      solution[py][px] = next_val;
    } else {
      if (backtracking) {
        pointer--;
      } else {
        pointer++;
      }
    }
    return doneSolving();
  }

  function gameLoop(delta) {
    if (solverRunning) {
      let done = doneSolving();
      if (done) {
        setSolverRunning(false);
        return;
      }

      frameTime += delta;
      if (frameTime > delay) {
        frameTime = 0;
        iterate(positions);
      }
    }
    redraw();
  }

  function createButton(text) {
    const btn = new PIXI.Graphics();
    btn.interactive = true;
    btn.lineStyle(2, 0x000000, 1);
    btn.beginFill(0xFFFFFF);
    btn.drawRect(0, 0, 100, Math.floor(uiHeigth * 0.5));
    btn.endFill();
    const btnText = new PIXI.Text(text, btnTextStyle);
    btnText.pivot.x = btnText.width / 2;
    btnText.pivot.y = btnText.height / 2;
    btnText.x = btn.width / 2;
    btnText.y = btn.height / 2;
    btn.text = btnText;
    btn.addChild(btnText);
    return btn
  }

  function createUiElements() {
    btnStartStop = createButton(msgSolve);
    btnStartStop.on('pointerdown', onStartStopClick);
    uiConntainer.addChild(btnStartStop);

    btnSuffle = createButton(msgShuffle)
    btnSuffle.x = btnStartStop.x + 10 + btnStartStop.width;
    btnSuffle.on('pointerdown', onShuffleClick);
    uiConntainer.addChild(btnSuffle);

    uiConntainer.pivot.x = uiConntainer.width / 2;
    uiConntainer.pivot.y = uiConntainer.height / 2;
    uiConntainer.x = app.screen.width / 2;
    // uiConntainer.y = boardContainer.height + uiConntainer.pivot.y + 10;
    uiConntainer.y = boardSize + Math.floor(uiHeigth/2) + marging;
  }

  function setSolverRunning(status) {
    solverRunning = status;
    updateControlElements();
  }

  function onStartStopClick(coord) {
    setSolverRunning(!solverRunning)
  }

  function onShuffleClick(coord) {
    if (!solverRunning) {
      pointer = 0;
      generateBoard();
      // redraw();
    }
  }

  function updateControlElements() {
    btnSuffle.text.alpha = solverRunning ? 0.2 : 1;
    btnStartStop.text.text = solverRunning ? msgPause : msgSolve;
  }

  function pointerData(value) {
    const row = Math.floor(value / 9)
    const col = value % 9
    return [row, col]
  }

  function redraw() {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        let value = board[y][x];
        let editable = value === 0;
        value = editable ? solution[y][x] : value;
        positions[y][x].text = `${value === 0 ? '' : value}`;
        positions[y][x].alpha = editable ? 1 : 0.5;
      }
    }
  }
  function drawPosition() {
    positions = []
    for (let y = 0; y < 9; y++) {
      let line = []
      for (let x = 0; x < 9; x++) {
        const coord_x = Math.floor(step * (x + 0.35))
        const coord_y = Math.floor(step * (y + 0.22));
        let value = board[y][x]
        value = value === 0 ? '' : value;

        const text = new PIXI.Text(value, cellTextStyle);
        text.x = coord_x;
        text.y = coord_y;
        line.push(text);
        boardContainer.addChild(text);
      }
      positions.push(line)
    }
  }

  function createBoard() {
    const borders = new Pem();
    borders.lineStyle(sm ? 2: 3, 0x000000, 1);

    const divisions = new Pem();
    divisions.lineStyle(1, 0x000000, 0.5);

    const boardLines = [divisions, borders];

    for (let i = 0; i < 10; i++) {
      let line = boardLines[+(i % 3 === 0)];
      line.drawLine(0, i * step, boardSize, i * step);
      line.drawLine(i * step, 0, i * step, boardSize);
    }
    boardContainer.addChild(borders);
    boardContainer.addChild(divisions);

    boardContainer.x = app.screen.width / 2;
    boardContainer.y = marging;
    boardContainer.pivot.x = boardContainer.width / 2;
    boardContainer.pivot.y = 0;
  }

  function create() {
    generateBoard();
    createBoard();
    drawPosition();
    createUiElements();
  }

  create();
  app.ticker.add(gameLoop);
  return app;
}