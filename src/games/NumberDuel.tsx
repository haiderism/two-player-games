import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Dice6, Clock, Zap } from 'lucide-react'

type QuestionType = 'arithmetic' | 'sequence' | 'logic' | 'comparison' | 'pattern'

interface Question {
  type: QuestionType
  question: string
  answer: number
  options?: number[]
}

interface GameState {
  currentQuestion: Question | null
  questionNumber: number
  totalQuestions: number
  scores: { player1: number; player2: number }
  currentPlayer: 1 | 2
  timeLeft: number
  gameActive: boolean
  gameOver: boolean
  winner: 1 | 2 | null
  playerAnswer: string
  showResult: boolean
  lastResult: 'correct' | 'incorrect' | 'timeout' | null
  questionStartTime: number
}

const NumberDuel: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    questionNumber: 0,
    totalQuestions: 10,
    scores: { player1: 0, player2: 0 },
    currentPlayer: 1,
    timeLeft: 15,
    gameActive: false,
    gameOver: false,
    winner: null,
    playerAnswer: '',
    showResult: false,
    lastResult: null,
    questionStartTime: 0
  })

  // Generate arithmetic question
  const generateArithmetic = (): Question => {
    const operations = ['+', '-', '*', '/']
    const op = operations[Math.floor(Math.random() * operations.length)]
    let a, b, answer, question
    
    switch (op) {
      case '+':
        a = Math.floor(Math.random() * 100) + 1
        b = Math.floor(Math.random() * 100) + 1
        answer = a + b
        question = `${a} + ${b}`
        break
      case '-':
        a = Math.floor(Math.random() * 100) + 50
        b = Math.floor(Math.random() * 50) + 1
        answer = a - b
        question = `${a} - ${b}`
        break
      case '*':
        a = Math.floor(Math.random() * 15) + 1
        b = Math.floor(Math.random() * 15) + 1
        answer = a * b
        question = `${a} × ${b}`
        break
      case '/':
        answer = Math.floor(Math.random() * 20) + 1
        b = Math.floor(Math.random() * 10) + 2
        a = answer * b
        question = `${a} ÷ ${b}`
        break
      default:
        a = 1; b = 1; answer = 2; question = '1 + 1'
    }
    
    return { type: 'arithmetic', question, answer }
  }

  // Generate sequence question
  const generateSequence = (): Question => {
    const sequences = [
      { pattern: [2, 4, 6, 8], next: 10, desc: '2, 4, 6, 8, ?' },
      { pattern: [1, 4, 9, 16], next: 25, desc: '1, 4, 9, 16, ?' },
      { pattern: [3, 6, 12, 24], next: 48, desc: '3, 6, 12, 24, ?' },
      { pattern: [1, 1, 2, 3, 5], next: 8, desc: '1, 1, 2, 3, 5, ?' },
      { pattern: [10, 20, 15, 25, 20], next: 30, desc: '10, 20, 15, 25, 20, ?' },
      { pattern: [100, 50, 25], next: 12, desc: '100, 50, 25, ?' },
      { pattern: [1, 3, 7, 15], next: 31, desc: '1, 3, 7, 15, ?' },
    ]
    
    const seq = sequences[Math.floor(Math.random() * sequences.length)]
    return { type: 'sequence', question: seq.desc, answer: seq.next }
  }

  // Generate logic question
  const generateLogic = (): Question => {
    const questions = [
      { q: 'If 5 cats catch 5 mice in 5 minutes, how many cats catch 100 mice in 100 minutes?', a: 5 },
      { q: 'A farmer has 17 sheep. All but 9 die. How many are left?', a: 9 },
      { q: 'How many months have 28 days?', a: 12 },
      { q: 'If you have 3 apples and take away 2, how many do you have?', a: 2 },
      { q: 'What comes next: 1, 11, 21, 1211, 111221, ?', a: 312211 },
      { q: 'A clock shows 3:15. What is the angle between the hands? (in degrees)', a: 7 },
      { q: 'How many triangles are in a pentagram (5-pointed star)?', a: 35 },
    ]
    
    const q = questions[Math.floor(Math.random() * questions.length)]
    return { type: 'logic', question: q.q, answer: q.a }
  }

  // Generate comparison question
  const generateComparison = (): Question => {
    const questions = [
      { q: 'Which is larger: 2^10 or 10^2?', a: 1024, desc: '2^10 = 1024, 10^2 = 100. Answer: 1024' },
      { q: 'How many seconds in 2 hours?', a: 7200 },
      { q: 'What is 15% of 200?', a: 30 },
      { q: 'How many minutes in a day?', a: 1440 },
      { q: 'What is the square root of 144?', a: 12 },
      { q: 'How many degrees in a circle?', a: 360 },
      { q: 'What is 7 factorial (7!)?', a: 5040 },
    ]
    
    const q = questions[Math.floor(Math.random() * questions.length)]
    return { type: 'comparison', question: q.q, answer: q.a }
  }

  // Generate pattern question
  const generatePattern = (): Question => {
    const patterns = [
      { q: 'Complete: 2, 6, 18, 54, ?', a: 162 },
      { q: 'Complete: 1, 4, 13, 40, ?', a: 121 },
      { q: 'Complete: 3, 8, 18, 33, ?', a: 53 },
      { q: 'Complete: 5, 11, 23, 47, ?', a: 95 },
      { q: 'Complete: 2, 5, 11, 23, ?', a: 47 },
      { q: 'Complete: 1, 2, 6, 24, ?', a: 120 },
    ]
    
    const p = patterns[Math.floor(Math.random() * patterns.length)]
    return { type: 'pattern', question: p.q, answer: p.a }
  }

  // Generate random question
  const generateQuestion = (): Question => {
    const types: QuestionType[] = ['arithmetic', 'sequence', 'logic', 'comparison', 'pattern']
    const type = types[Math.floor(Math.random() * types.length)]
    
    switch (type) {
      case 'arithmetic': return generateArithmetic()
      case 'sequence': return generateSequence()
      case 'logic': return generateLogic()
      case 'comparison': return generateComparison()
      case 'pattern': return generatePattern()
      default: return generateArithmetic()
    }
  }

  // Start new question
  const startNewQuestion = () => {
    if (gameState.questionNumber >= gameState.totalQuestions) {
      endGame()
      return
    }

    const question = generateQuestion()
    setGameState(prev => ({
      ...prev,
      currentQuestion: question,
      questionNumber: prev.questionNumber + 1,
      timeLeft: 15,
      gameActive: true,
      playerAnswer: '',
      showResult: false,
      lastResult: null,
      questionStartTime: Date.now()
    }))
  }

  // Submit answer
  const submitAnswer = () => {
    if (!gameState.gameActive || !gameState.currentQuestion) return

    const answer = parseInt(gameState.playerAnswer)
    const isCorrect = answer === gameState.currentQuestion.answer
    const responseTime = Date.now() - gameState.questionStartTime
    
    // Bonus points for quick answers (under 5 seconds)
    const basePoints = isCorrect ? 1 : 0
    const speedBonus = isCorrect && responseTime < 5000 ? 1 : 0
    const totalPoints = basePoints + speedBonus

    const newScores = { ...gameState.scores }
    if (gameState.currentPlayer === 1) {
      newScores.player1 += totalPoints
    } else {
      newScores.player2 += totalPoints
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
      startNewQuestion()
    }, 2500)
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
      startNewQuestion()
    }, 2500)
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
      currentQuestion: null,
      questionNumber: 0,
      totalQuestions: 10,
      scores: { player1: 0, player2: 0 },
      currentPlayer: 1,
      timeLeft: 15,
      gameActive: false,
      gameOver: false,
      winner: null,
      playerAnswer: '',
      showResult: false,
      lastResult: null,
      questionStartTime: 0
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

  // Get question type icon
  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'arithmetic': return '🧮'
      case 'sequence': return '🔢'
      case 'logic': return '🧠'
      case 'comparison': return '⚖️'
      case 'pattern': return '🔍'
      default: return '❓'
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
                <Dice6 className="h-8 w-8 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.questionNumber === 0 ? 'Number Duel' : `Question ${gameState.questionNumber}/${gameState.totalQuestions}`}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Score - Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}
              </p>
              {gameState.gameActive && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className={`font-bold ${
                    gameState.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'
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
        {gameState.questionNumber === 0 && !gameState.gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Number Duel
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Answer {gameState.totalQuestions} math and logic questions. Quick answers get bonus points!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🧮</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Arithmetic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔢</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sequences</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Logic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚖️</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Comparison</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Patterns</div>
              </div>
            </div>
            <button
              onClick={startNewQuestion}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Dice6 className="h-5 w-5" />
              <span>Start Duel</span>
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
            {gameState.currentQuestion && (
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Answer: {gameState.currentQuestion.answer}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-300">
              Player {gameState.currentPlayer === 1 ? 2 : 1} {gameState.lastResult === 'correct' ? 'scored!' : 'gets next question'}
            </p>
          </div>
        ) : gameState.gameActive && gameState.currentQuestion ? (
          <div>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-2xl">
                  {getQuestionTypeIcon(gameState.currentQuestion.type)}
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Player {gameState.currentPlayer}'s Turn
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-900 dark:text-white">
                  {gameState.currentQuestion.question}
                </p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <input
                type="number"
                value={gameState.playerAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, playerAnswer: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your answer..."
                autoFocus
              />
              <button
                onClick={submitAnswer}
                className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>Submit Answer</span>
              </button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
              💡 Quick answers (under 5 seconds) get bonus points!
            </div>
          </div>
        ) : null}

        {/* Controls */}
        {(gameState.gameOver || gameState.questionNumber === 0) && (
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

export default NumberDuel