import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Zap, Clock } from 'lucide-react'

type MiniGame = 'pattern' | 'math' | 'reaction' | 'memory' | 'sequence'

interface GameState {
  currentGame: MiniGame | null
  currentPlayer: 1 | 2
  scores: { player1: number; player2: number }
  round: number
  totalRounds: number
  timeLeft: number
  gameActive: boolean
  gameOver: boolean
  winner: 1 | 2 | null
  currentChallenge: any
  playerAnswer: string
  showResult: boolean
  lastResult: 'correct' | 'incorrect' | 'timeout' | null
}

const LightningRounds: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    currentPlayer: 1,
    scores: { player1: 0, player2: 0 },
    round: 0,
    totalRounds: 10,
    timeLeft: 30,
    gameActive: false,
    gameOver: false,
    winner: null,
    currentChallenge: null,
    playerAnswer: '',
    showResult: false,
    lastResult: null
  })

  const miniGames: MiniGame[] = ['pattern', 'math', 'reaction', 'memory', 'sequence']

  // Generate pattern challenge
  const generatePatternChallenge = () => {
    const patterns = [
      { sequence: [1, 2, 3, 4], next: 5 },
      { sequence: [2, 4, 6, 8], next: 10 },
      { sequence: [1, 4, 9, 16], next: 25 },
      { sequence: [5, 10, 15, 20], next: 25 },
      { sequence: [1, 1, 2, 3, 5], next: 8 },
    ]
    return patterns[Math.floor(Math.random() * patterns.length)]
  }

  // Generate math challenge
  const generateMathChallenge = () => {
    const operations = ['+', '-', '*']
    const op = operations[Math.floor(Math.random() * operations.length)]
    let a, b, answer
    
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1
        b = Math.floor(Math.random() * 50) + 1
        answer = a + b
        break
      case '-':
        a = Math.floor(Math.random() * 50) + 25
        b = Math.floor(Math.random() * 25) + 1
        answer = a - b
        break
      case '*':
        a = Math.floor(Math.random() * 12) + 1
        b = Math.floor(Math.random() * 12) + 1
        answer = a * b
        break
      default:
        a = 1; b = 1; answer = 2
    }
    
    return { question: `${a} ${op} ${b}`, answer }
  }

  // Generate reaction challenge
  const generateReactionChallenge = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple']
    const words = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE']
    
    const colorIndex = Math.floor(Math.random() * colors.length)
    const wordIndex = Math.floor(Math.random() * words.length)
    
    return {
      word: words[wordIndex],
      color: colors[colorIndex],
      correctAnswer: colors[colorIndex]
    }
  }

  // Generate memory challenge
  const generateMemoryChallenge = () => {
    const sequence: number[] = []
    const length = Math.floor(Math.random() * 3) + 4 // 4-6 numbers
    
    for (let i = 0; i < length; i++) {
      sequence.push(Math.floor(Math.random() * 9) + 1)
    }
    
    return { sequence, answer: sequence.join('') }
  }

  // Generate sequence challenge
  const generateSequenceChallenge = () => {
    const sequences = [
      { pattern: 'A, B, C, D, ?', answer: 'E' },
      { pattern: 'Z, Y, X, W, ?', answer: 'V' },
      { pattern: 'A, C, E, G, ?', answer: 'I' },
      { pattern: 'B, D, F, H, ?', answer: 'J' },
    ]
    return sequences[Math.floor(Math.random() * sequences.length)]
  }

  // Start new round
  const startNewRound = () => {
    if (gameState.round >= gameState.totalRounds) {
      endGame()
      return
    }

    const randomGame = miniGames[Math.floor(Math.random() * miniGames.length)]
    let challenge

    switch (randomGame) {
      case 'pattern':
        challenge = generatePatternChallenge()
        break
      case 'math':
        challenge = generateMathChallenge()
        break
      case 'reaction':
        challenge = generateReactionChallenge()
        break
      case 'memory':
        challenge = generateMemoryChallenge()
        break
      case 'sequence':
        challenge = generateSequenceChallenge()
        break
    }

    setGameState(prev => ({
      ...prev,
      currentGame: randomGame,
      round: prev.round + 1,
      timeLeft: 30,
      gameActive: true,
      currentChallenge: challenge,
      playerAnswer: '',
      showResult: false,
      lastResult: null
    }))
  }

  // Submit answer
  const submitAnswer = () => {
    if (!gameState.gameActive || !gameState.currentChallenge) return

    let isCorrect = false
    const answer = gameState.playerAnswer.toLowerCase().trim()

    switch (gameState.currentGame) {
      case 'pattern':
        isCorrect = parseInt(answer) === gameState.currentChallenge.next
        break
      case 'math':
        isCorrect = parseInt(answer) === gameState.currentChallenge.answer
        break
      case 'reaction':
        isCorrect = answer === gameState.currentChallenge.correctAnswer
        break
      case 'memory':
        isCorrect = answer === gameState.currentChallenge.answer
        break
      case 'sequence':
        isCorrect = answer === gameState.currentChallenge.answer.toLowerCase()
        break
    }

    const newScores = { ...gameState.scores }
    if (isCorrect) {
      if (gameState.currentPlayer === 1) {
        newScores.player1++
      } else {
        newScores.player2++
      }
    }

    setGameState(prev => ({
      ...prev,
      scores: newScores,
      gameActive: false,
      showResult: true,
      lastResult: isCorrect ? 'correct' : 'incorrect',
      currentPlayer: prev.currentPlayer === 1 ? 2 : 1
    }))

    setTimeout(() => {
      startNewRound()
    }, 2000)
  }

  // Handle timeout
  const handleTimeout = () => {
    setGameState(prev => ({
      ...prev,
      gameActive: false,
      showResult: true,
      lastResult: 'timeout',
      currentPlayer: prev.currentPlayer === 1 ? 2 : 1
    }))

    setTimeout(() => {
      startNewRound()
    }, 2000)
  }

  // End game
  const endGame = () => {
    const winner = gameState.scores.player1 > gameState.scores.player2 ? 1 :
                   gameState.scores.player2 > gameState.scores.player1 ? 2 : null

    setGameState(prev => ({
      ...prev,
      gameOver: true,
      winner,
      gameActive: false
    }))
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      currentGame: null,
      currentPlayer: 1,
      scores: { player1: 0, player2: 0 },
      round: 0,
      totalRounds: 10,
      timeLeft: 30,
      gameActive: false,
      gameOver: false,
      winner: null,
      currentChallenge: null,
      playerAnswer: '',
      showResult: false,
      lastResult: null
    })
  }

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (gameState.gameActive && gameState.timeLeft > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }))
      }, 1000)
    } else if (gameState.gameActive && gameState.timeLeft === 0) {
      handleTimeout()
    }
    return () => clearTimeout(timer)
  }, [gameState.gameActive, gameState.timeLeft])

  // Render challenge
  const renderChallenge = () => {
    if (!gameState.currentGame || !gameState.currentChallenge) return null

    switch (gameState.currentGame) {
      case 'pattern':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Complete the Pattern</h3>
            <p className="text-lg mb-4">
              {gameState.currentChallenge.sequence.join(', ')}, ?
            </p>
          </div>
        )
      case 'math':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Solve the Math Problem</h3>
            <p className="text-2xl mb-4">{gameState.currentChallenge.question} = ?</p>
          </div>
        )
      case 'reaction':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">What COLOR is this word?</h3>
            <p 
              className="text-4xl font-bold mb-4"
              style={{ color: gameState.currentChallenge.color }}
            >
              {gameState.currentChallenge.word}
            </p>
          </div>
        )
      case 'memory':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Remember this sequence</h3>
            <p className="text-2xl mb-4">
              {gameState.currentChallenge.sequence.join(' - ')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type the numbers without spaces
            </p>
          </div>
        )
      case 'sequence':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Complete the Letter Sequence</h3>
            <p className="text-xl mb-4">{gameState.currentChallenge.pattern}</p>
          </div>
        )
    }
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
                <Zap className="h-8 w-8 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.round === 0 ? 'Ready to Start!' : `Round ${gameState.round}/${gameState.totalRounds}`}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Score - Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}
              </p>
              {gameState.gameActive && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className={`font-bold ${
                    gameState.timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'
                  }`}>
                    {gameState.timeLeft}s
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
        {gameState.round === 0 && !gameState.gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Lightning Rounds
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get ready for {gameState.totalRounds} quick challenges! Each player gets 30 seconds per round.
            </p>
            <button
              onClick={startNewRound}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Zap className="h-5 w-5" />
              <span>Start Game</span>
            </button>
          </div>
        ) : gameState.showResult ? (
          <div className="text-center">
            <div className={`text-4xl font-bold mb-4 ${
              gameState.lastResult === 'correct' ? 'text-green-500' :
              gameState.lastResult === 'incorrect' ? 'text-red-500' : 'text-orange-500'
            }`}>
              {gameState.lastResult === 'correct' ? '✓ Correct!' :
               gameState.lastResult === 'incorrect' ? '✗ Incorrect!' : '⏰ Time Up!'}
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Player {gameState.currentPlayer === 1 ? 2 : 1} scored!
            </p>
          </div>
        ) : gameState.gameActive ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Player {gameState.currentPlayer}'s Turn
              </h2>
              {renderChallenge()}
            </div>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={gameState.playerAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, playerAnswer: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your answer..."
                autoFocus
              />
              <button
                onClick={submitAnswer}
                className="w-full mt-4 btn-primary"
              >
                Submit Answer
              </button>
            </div>
          </div>
        ) : null}

        {/* Controls */}
        {(gameState.gameOver || gameState.round === 0) && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Game</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LightningRounds