import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Target } from 'lucide-react'

type Player = 1 | 2
type LineType = 'horizontal' | 'vertical'

interface Line {
  row: number
  col: number
  type: LineType
  drawn: boolean
  player?: Player
}

interface Box {
  row: number
  col: number
  owner?: Player
  completed: boolean
}

interface GameState {
  lines: Line[]
  boxes: Box[]
  currentPlayer: Player
  scores: { player1: number; player2: number }
  gameOver: boolean
  winner: Player | null
  lastCompletedBoxes: Box[]
}

const DotsAndBoxes: React.FC = () => {
  const GRID_SIZE = 4 // 4x4 grid of boxes (5x5 dots)
  
  const [gameState, setGameState] = useState<GameState>({
    lines: [],
    boxes: [],
    currentPlayer: 1,
    scores: { player1: 0, player2: 0 },
    gameOver: false,
    winner: null,
    lastCompletedBoxes: []
  })

  // Initialize game
  const initializeGame = () => {
    const lines: Line[] = []
    const boxes: Box[] = []

    // Create horizontal lines
    for (let row = 0; row <= GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        lines.push({
          row,
          col,
          type: 'horizontal',
          drawn: false
        })
      }
    }

    // Create vertical lines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col <= GRID_SIZE; col++) {
        lines.push({
          row,
          col,
          type: 'vertical',
          drawn: false
        })
      }
    }

    // Create boxes
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        boxes.push({
          row,
          col,
          completed: false
        })
      }
    }

    setGameState({
      lines,
      boxes,
      currentPlayer: 1,
      scores: { player1: 0, player2: 0 },
      gameOver: false,
      winner: null,
      lastCompletedBoxes: []
    })
  }

  // Check if a box is completed
  const isBoxCompleted = (box: Box, lines: Line[]): boolean => {
    const topLine = lines.find(l => l.type === 'horizontal' && l.row === box.row && l.col === box.col)
    const bottomLine = lines.find(l => l.type === 'horizontal' && l.row === box.row + 1 && l.col === box.col)
    const leftLine = lines.find(l => l.type === 'vertical' && l.row === box.row && l.col === box.col)
    const rightLine = lines.find(l => l.type === 'vertical' && l.row === box.row && l.col === box.col + 1)

    return !!(topLine?.drawn && bottomLine?.drawn && leftLine?.drawn && rightLine?.drawn)
  }

  // Handle line click
  const handleLineClick = (clickedLine: Line) => {
    if (clickedLine.drawn || gameState.gameOver) return

    const newLines = gameState.lines.map(line => 
      line === clickedLine 
        ? { ...line, drawn: true, player: gameState.currentPlayer }
        : line
    )

    // Check for newly completed boxes
    const newBoxes = gameState.boxes.map(box => {
      if (!box.completed && isBoxCompleted(box, newLines)) {
        return { ...box, completed: true, owner: gameState.currentPlayer }
      }
      return box
    })

    const completedBoxes = newBoxes.filter(box => 
      box.completed && !gameState.boxes.find(b => b.row === box.row && b.col === box.col)?.completed
    )

    const newScores = {
      player1: newBoxes.filter(box => box.owner === 1).length,
      player2: newBoxes.filter(box => box.owner === 2).length
    }

    // Check if game is over
    const totalBoxes = GRID_SIZE * GRID_SIZE
    const gameOver = newScores.player1 + newScores.player2 === totalBoxes
    const winner = gameOver 
      ? newScores.player1 > newScores.player2 
        ? 1 
        : newScores.player2 > newScores.player1 
          ? 2 
          : null
      : null

    // Player gets another turn if they completed a box
    const nextPlayer = completedBoxes.length > 0 ? gameState.currentPlayer : (gameState.currentPlayer === 1 ? 2 : 1)

    setGameState({
      lines: newLines,
      boxes: newBoxes,
      currentPlayer: nextPlayer,
      scores: newScores,
      gameOver,
      winner,
      lastCompletedBoxes: completedBoxes
    })
  }

  // Reset game
  const resetGame = () => {
    initializeGame()
  }

  // Initialize on mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Get line style
  const getLineStyle = (line: Line): string => {
    if (!line.drawn) {
      return line.type === 'horizontal' 
        ? 'h-1 bg-gray-300 hover:bg-gray-400 cursor-pointer transition-colors duration-200'
        : 'w-1 bg-gray-300 hover:bg-gray-400 cursor-pointer transition-colors duration-200'
    }
    
    const playerColor = line.player === 1 ? 'bg-blue-500' : 'bg-red-500'
    return line.type === 'horizontal' 
      ? `h-1 ${playerColor}`
      : `w-1 ${playerColor}`
  }

  // Get box style
  const getBoxStyle = (box: Box): string => {
    if (!box.completed) {
      return 'bg-gray-50 dark:bg-gray-800'
    }
    
    const isNewlyCompleted = gameState.lastCompletedBoxes.some(b => b.row === box.row && b.col === box.col)
    const baseColor = box.owner === 1 ? 'bg-blue-200 dark:bg-blue-900' : 'bg-red-200 dark:bg-red-900'
    const animation = isNewlyCompleted ? 'animate-pulse' : ''
    
    return `${baseColor} ${animation}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gameOver ? (
            <div className="animate-bounce-in">
              <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.winner ? `Player ${gameState.winner} Wins!` : "It's a Tie!"}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Final Score: Player 1: {gameState.scores.player1}, Player 2: {gameState.scores.player2}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-2">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white">
                  Player {gameState.currentPlayer}'s Turn
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Score - Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
        <div className="flex justify-center">
          <div className="inline-block">
            {/* Grid */}
            <div className="relative">
              {/* Dots */}
              {Array.from({ length: GRID_SIZE + 1 }, (_, row) =>
                Array.from({ length: GRID_SIZE + 1 }, (_, col) => (
                  <div
                    key={`dot-${row}-${col}`}
                    className="absolute w-3 h-3 bg-gray-800 dark:bg-gray-200 rounded-full"
                    style={{
                      left: `${col * 80}px`,
                      top: `${row * 80}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))
              )}

              {/* Horizontal Lines */}
              {gameState.lines
                .filter(line => line.type === 'horizontal')
                .map((line, index) => (
                  <div
                    key={`h-line-${index}`}
                    className={`absolute ${getLineStyle(line)}`}
                    style={{
                      left: `${line.col * 80 + 6}px`,
                      top: `${line.row * 80}px`,
                      width: '68px',
                      transform: 'translateY(-50%)'
                    }}
                    onClick={() => handleLineClick(line)}
                  />
                ))
              }

              {/* Vertical Lines */}
              {gameState.lines
                .filter(line => line.type === 'vertical')
                .map((line, index) => (
                  <div
                    key={`v-line-${index}`}
                    className={`absolute ${getLineStyle(line)}`}
                    style={{
                      left: `${line.col * 80}px`,
                      top: `${line.row * 80 + 6}px`,
                      height: '68px',
                      transform: 'translateX(-50%)'
                    }}
                    onClick={() => handleLineClick(line)}
                  />
                ))
              }

              {/* Boxes */}
              {gameState.boxes.map((box, index) => (
                <div
                  key={`box-${index}`}
                  className={`absolute ${getBoxStyle(box)} rounded-lg flex items-center justify-center`}
                  style={{
                    left: `${box.col * 80 + 6}px`,
                    top: `${box.row * 80 + 6}px`,
                    width: '68px',
                    height: '68px'
                  }}
                >
                  {box.completed && (
                    <span className={`text-2xl font-bold ${
                      box.owner === 1 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {box.owner}
                    </span>
                  )}
                </div>
              ))}

              {/* Grid container */}
              <div 
                style={{ 
                  width: `${GRID_SIZE * 80}px`, 
                  height: `${GRID_SIZE * 80}px` 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-8">
          <button
            onClick={resetGame}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>New Game</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Click on the lines between dots to draw them.</p>
          <p>Complete a box to score a point and get another turn!</p>
        </div>
      </div>
    </div>
  )
}

export default DotsAndBoxes