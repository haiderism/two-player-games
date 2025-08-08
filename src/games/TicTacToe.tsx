import React, { useState, useEffect } from 'react'
import { X, Circle, RotateCcw, Trophy } from 'lucide-react'

type Player = 'X' | 'O' | null
type Board = Player[]

interface GameState {
  board: Board
  currentPlayer: Player
  winner: Player
  isDraw: boolean
  gameOver: boolean
}

const TicTacToe: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    isDraw: false,
    gameOver: false,
  })
  
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [winningLine, setWinningLine] = useState<number[]>([])

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ]

  const checkWinner = (board: Board): { winner: Player; winningLine: number[] } => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], winningLine: combination }
      }
    }
    return { winner: null, winningLine: [] }
  }

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.gameOver) return

    const newBoard = [...gameState.board]
    newBoard[index] = gameState.currentPlayer

    const { winner, winningLine } = checkWinner(newBoard)
    const isDraw = !winner && newBoard.every(cell => cell !== null)

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      isDraw,
      gameOver: winner !== null || isDraw,
    })

    setWinningLine(winningLine)
  }

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      gameOver: false,
    })
    setWinningLine([])
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
  }

  useEffect(() => {
    if (gameState.winner) {
      setScores(prev => ({
        ...prev,
        [gameState.winner!]: prev[gameState.winner!] + 1
      }))
    } else if (gameState.isDraw) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [gameState.winner, gameState.isDraw])

  const renderCell = (index: number) => {
    const value = gameState.board[index]
    const isWinningCell = winningLine.includes(index)
    
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        className={`
          aspect-square bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 
          rounded-lg flex items-center justify-center text-4xl font-bold transition-all duration-200
          hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500
          ${isWinningCell ? 'bg-green-100 dark:bg-green-900/20 border-green-400 dark:border-green-500' : ''}
          ${!value && !gameState.gameOver ? 'cursor-pointer' : 'cursor-default'}
        `}
        disabled={!!value || gameState.gameOver}
      >
        {value === 'X' && (
          <X className={`h-12 w-12 ${isWinningCell ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
        )}
        {value === 'O' && (
          <Circle className={`h-12 w-12 ${isWinningCell ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
        )}
      </button>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
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
                {gameState.currentPlayer === 'X' ? (
                  <X className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Circle className="h-8 w-8 text-red-600 dark:text-red-400" />
                )}
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
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {gameState.board.map((_, index) => renderCell(index))}
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
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <X className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {scores.X}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player X
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
              {scores.draws}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Draws
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Circle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {scores.O}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player O
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicTacToe