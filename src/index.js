import React from 'react';
import ReactDOM from 'react-dom';
/*import App from './App';*/
import './index.css';

function Square(props) {
    if (props.highlight) {
        // console.log("highlight");
        return (
            <button className="square" style={{color: 'orange'}} onClick={() => props.onClick()}>
                {props.value}
            </button>
        );
    } else {
        // console.log("no highlight");
        return (

            <button className="square" onClick={() => props.onClick()}>
                {props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, j) {
        const squares = this.props.squares;

        let won = false;
        if (this.props.winningPos) {
            // If there is a winning position and positions exist on board
            let fpos1 = this.props.winningPos[0];
            let cpos1 = this.props.winningPos[1];
            let fpos2 = this.props.winningPos[2];
            let cpos2 = this.props.winningPos[3];
            let fpos3 = this.props.winningPos[4];
            let cpos3 = this.props.winningPos[5];
            if ((fpos1 === i && cpos1 === j) || (fpos2 === i && cpos2 === j) || (fpos3 === i && cpos3 === j)) {
                won = true;
            }
        }
        return <Square value={squares[i][j]} highlight={won} onClick={() => this.props.onClick(i, j)}/>;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        let i, j;
        var matrix = new Array(3);
        for (i = 0; i < 3; i++) {
            matrix[i] = new Array(3);
        }
        for (i = 0; i < matrix.length; i++) {
            for (j = 0; j < matrix[0].length; j++) {
                matrix[i][j] = null;
            }
        }
        this.state = {
            history: [{
                squares: matrix,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i, j) {
        var history = this.state.history.slice(0, this.state.stepNumber + 1);
        var current = history[history.length - 1];
        let x, y;
        //creo squares
        var squares = new Array(3);
        for (x = 0; x < 3; x++) {
            squares[x] = new Array(3);
        }
        for (x = 0; x < squares.length; x++) {
            for (y = 0; y < squares[0].length; y++) {
                squares[x][y] = null;
            }
        }
        //actualizo squares con current
        for (x = 0; x < current.squares.length; x++) {
            for (y = 0; y < current.squares[0].length; y++) {
                squares[x][y] = current.squares[x][y];
            }
        }
        //const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i][j]) {
            return;
        }

        squares[i][j] = this.state.xIsNext ? 'X' : 'O';


        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    /*
     * Reverse the moves list
     */
    toggleSort() {
        const ascending = this.state.ascending;
        this.setState({
            ascending: !ascending,
        });
    }

    startOver() {
        this.setState({
            history: [{
                squares: Array(3).fill(Array(3).fill(null))
            }],
            xIsNext: true,
            stepNumber: 0,
            ascending: true,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (!(step % 2)),
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status, comb;
        if (winner) {
            status = 'Winner: ' + winner.winner;
            comb = winner.comb;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move :
                'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}</a>
                </li>
            );
        });

        return (
            <div className="game">
                <div>
                    <Board
                        squares={current.squares}
                        winningPos={comb}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleSort()}> Order</button>
                    {(() => this.state.ascending === true ? <ol>{moves}</ol> : <ol>{moves.reverse()}</ol>)()}
                    <button onClick={() => this.startOver()}> Start Over</button>
                </div>
            </div>
        );
    }
}

// ========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 0, 0, 1, 0, 2],
        [1, 0, 1, 1, 1, 2],
        [2, 0, 2, 1, 2, 2],
        [0, 0, 1, 0, 2, 0],
        [0, 1, 1, 1, 2, 1],
        [0, 2, 1, 2, 2, 2],
        [0, 0, 1, 1, 2, 2],
        [0, 2, 1, 1, 2, 0],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e, f] = lines[i];
        if (squares[a][b] && squares[a][b] === squares[c][d] && squares[a][b] === squares[e][f]) {
            return {
                winner: squares[a][b],
                comb: lines[i]
            };
        }
    }
    return null;
}