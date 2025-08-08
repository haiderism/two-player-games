import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Circle } from 'lucide-react'

type Player = 1 | 2 | null
type Board = Player[][]

interface GameState {
  board: Board
  currentPlayer: Player
  winner: Player
  gameOver: boolean
  winningCells: [number, number][]
}

const ROWS = 6
const COLS = 7

const ConnectFour: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
    currentPlayer: 1,
    winner: null,
    gameOver: false,
    winningCells: [],
  })
  
  const [scores, setScores] = useState({ player1: 0, player2: 0 })
  const [dropAnimation, setDropAnimation] = useState<{ col: number; row: number } | null>(null)

  const checkWinner = (board: Board, row: number, col: number, player: Player): [number, number][] => {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal /
      [1, -1],  // Diagonal \
    ]

    for (const [deltaRow, deltaCol] of directions) {
      const cells: [number, number][] = [[row, col]]
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + deltaRow * i
        const newCol = col + deltaCol * i
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          cells.push([newRow, newCol])
        } else {
          break
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - deltaRow * i
        const newCol = col - deltaCol * i
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          cells.unshift([newRow, newCol])
        } else {
          break
        }
      }
      
      if (cells.length >= 4) {
        return cells.slice(0, 4) // Return first 4 connected cells
      }
    }
    
    return []
  }

  const dropDisc = (col: number) => {
    if (gameState.gameOver) return
    
    // Find the lowest empty row in the column
    let targetRow = -1
    for (let row = ROWS - 1; row >= 0; row--) {
      if (gameState.board[row][col] === null) {
        targetRow = row
        break
      }
    }
    
    if (targetRow === -1) return // Column is full
    
    // Animate the drop
    setDropAnimation({ col, row: targetRow })
    
    setTimeout(() => {
      const newBoard = gameState.board.map(row => [...row])
      newBoard[targetRow][col] = gameState.currentPlayer
      
      const winningCells = checkWinner(newBoard, targetRow, col, gameState.currentPlayer)
      const winner = winningCells.length > 0 ? gameState.currentPlayer : null
      const isBoardFull = newBoard.every(row => row.every(cell => cell !== null))
      
      setGameState({
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 1 ? 2 : 1,
        winner,
        gameOver: winner !== null || isBoardFull,
        winningCells,
      })
      
      setDropAnimation(null)
    }, 300)
  }

  const resetGame = () => {
    setGameState({
      board: Array(ROWS).fill(null).map(() => Array(COLS).fill(null)),
      currentPlayer: 1,
      winner: null,
      gameOver: false,
      winningCells: [],
    })
    setDropAnimation(null)
  }

  const resetScores = () => {
    setScores({ player1: 0, player2: 0 })
  }

  useEffect(() => {
    if (gameState.winner) {
      setScores(prev => ({
        ...prev,
        [`player${gameState.winner}`]: prev[`player${gameState.winner}` as keyof typeof prev] + 1
      }))
    }
  }, [gameState.winner])

  const isWinningCell = (row: number, col: number) => {
    return gameState.winningCells.some(([r, c]) => r === row && c === col)
  }

  const canDropInColumn = (col: number) => {
    return !gameState.gameOver && gameState.board[0][col] === null
  }

  const renderCell = (row: number, col: number) => {
    const cellValue = gameState.board[row][col]
    const isWinning = isWinningCell(row, col)
    const isAnimating = dropAnimation?.col === col && dropAnimation?.row === row
    
    return (
      <div
        key={`${row}-${col}`}
        className={`
          aspect-square bg-blue-600 dark:bg-blue-700 rounded-full border-4 border-blue-800 dark:border-blue-900
          flex items-center justify-center relative overflow-hidden
          ${isWinning ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
        `}
      >
        {cellValue && (
          <div
            className={`
              w-4/5 h-4/5 rounded-full transition-all duration-300
              ${cellValue === 1 
                ? 'bg-red-500 dark:bg-red-400' 
                : 'bg-yellow-500 dark:bg-yellow-400'
              }
              ${isWinning ? 'ring-2 ring-white' : ''}
              ${isAnimating ? 'animate-bounce' : ''}
            `}
          />
        )}
        {!cellValue && (
          <div className="w-4/5 h-4/5 rounded-full bg-white dark:bg-gray-200 opacity-20" />
        )}
      </div>
    )
  }

  const renderColumnButton = (col: number) => {
    const canDrop = canDropInColumn(col)
    
    return (
      <button
        key={col}
        onClick={() => dropDisc(col)}
        disabled={!canDrop}
        className={`
          h-12 rounded-lg transition-all duration-200 flex items-center justify-center
          ${canDrop 
            ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer' 
            : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
          }
        `}
      >
        <Circle 
          className={`h-6 w-6 ${
            gameState.currentPlayer === 1 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-yellow-500 dark:text-yellow-400'
          }`} 
        />
      </button>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gameOver ? (
            <div className="animate-bounce-in">
              {gameState.winner ? (
                <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">
                    Player {gameState.winner} Wins!
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  It's a Draw!
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-xl text-gray-600 dark:text-gray-300">Current Player:</span>
              <div className="flex items-center space-x-2">
                <Circle 
                  className={`h-8 w-8 ${
                    gameState.currentPlayer === 1 
                      ? 'text-red-500 dark:text-red-400' 
                      : 'text-yellow-500 dark:text-yellow-400'
                  }`} 
                />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  Player {gameState.currentPlayer}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        {/* Column Buttons */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array(COLS).fill(null).map((_, col) => renderColumnButton(col))}
        </div>
        
        {/* Board */}
        <div className="grid grid-cols-7 gap-2 bg-blue-800 dark:bg-blue-900 p-4 rounded-xl">
          {Array(ROWS).fill(null).map((_, row) =>
            Array(COLS).fill(null).map((_, col) => renderCell(row, col))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetGame}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </button>
          <button
            onClick={resetScores}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <span>Reset Scores</span>
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Scoreboard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Circle className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-500 dark:text-red-400">
              {scores.player1}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player 1
            </div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Circle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
              {scores.player2}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player 2
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectFour