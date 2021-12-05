import React, { Component } from 'react';
import './style.css';

export class App extends Component {
  cells = {};
  SIZE = 82;
  INTERVAL_TIMER;
  previousCells = [];
  moveStep = (shouldUpdate) => {
    this.previousCells.push(this.cells);
    this.processBoard();
    if (shouldUpdate) {
      this.forceUpdate();
    }
  };

  processBoard = () => {
    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const aliveNeighbours = this.getAliveNeighboursCount(i, j);
        this.cells[`${i},${j}`].aliveNeighbourCount = aliveNeighbours;
      }
    }
    Object.keys(this.cells).forEach((key) => {
      this.decideStatus(key);
    });
  };

  decideStatus = (key) => {
    const { status, aliveNeighbourCount } = this.cells[key];
    if (
      status === 'alive' &&
      (aliveNeighbourCount < 2 || aliveNeighbourCount > 3)
    ) {
      this.killCell(key);
    } else if (status === 'dead' && aliveNeighbourCount === 3) {
      this.resurrectCell(key);
    }
  };

  killCell = (key) => {
    const cell = document.getElementById(`cell${key}`);
    if (this.cells[key]) {
      this.cells[key].status = 'dead';
    }
    cell.setAttribute('class', 'dark');
  };

  resurrectCell = (key) => {
    const cell = document.getElementById(`cell${key}`);
    this.cells[key].status = 'alive';
    cell.setAttribute('class', 'light');
  };

  getAliveNeighboursCount = (i, j) => {
    let liveNeighbours = 0;
    const rowEnd = Math.min(this.SIZE, i + 2);
    const colEnd = Math.min(this.SIZE, j + 2);

    for (let row = Math.max(0, i - 1); row < rowEnd; row++) {
      for (let col = Math.max(0, j - 1); col < colEnd; col++) {
        // make sure to exclude the cell itself from calculation
        if (
          (row !== i || col !== j) &&
          this.cells[`${row},${col}`].status === 'alive'
        ) {
          liveNeighbours++;
        }
      }
    }
    return liveNeighbours;
  };

  play = () => {
    this.INTERVAL_TIMER = setInterval(this.moveStep, 100);
  };

  stop = () => {
    clearInterval(this.INTERVAL_TIMER);
  };

  resetBoard = () => {
    this.stop();
    this.previousCells = [];
    this.forceUpdate();
  };

  stepBack = () => {
    this.cells = this.previousCells.pop();
    this.processBoard();
  };

  render() {
    const grid = [];
    for (let i = 0; i < this.SIZE; i++) {
      const row = [];
      for (let j = 0; j < this.SIZE; j++) {
        const x = Math.floor(Math.random() * 2) === 0;
        if (this.previousCells.length === 0) {
          if (x) this.cells[`${i},${j}`] = { status: 'alive' };
          else this.cells[`${i},${j}`] = { status: 'dead' };
        }
        row.push(
          <td
            id={`cell${i},${j}`}
            key={`cell${i},${j}`}
            className={
              this.previousCells.length === 0
                ? x
                  ? 'light'
                  : 'dark'
                : this.cells[`${i},${j}`].status === 'alive'
                ? 'light'
                : 'dark'
            }
          ></td>
        );
      }
      grid.push(<tr key={`row${i}`}>{row}</tr>);
    }
    console.log(this.cells);
    return (
      <>
        <table className="chess-board">
          <tbody>{grid}</tbody>
        </table>
        <button onClick={this.play}>Play</button>
        <button onClick={this.stop}>Stop</button>
        <button onClick={() => this.moveStep(true)}>Next Step</button>
        <button
          disabled={this.previousCells.length === 0}
          onClick={this.stepBack}
        >
          Previous Step
        </button>
        <button onClick={this.resetBoard}>Reset Board</button>
      </>
    );
  }
}
