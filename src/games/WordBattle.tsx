import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Puzzle, Clock } from 'lucide-react'
import { validWords } from '../data/words'

interface GameState {
  letters: string[]
  player1Words: string[]
  player2Words: string[]
  currentPlayer: 1 | 2
  timeLeft: number
  gameActive: boolean
  gameOver: boolean
  scores: { player1: number; player2: number }
  winner: 1 | 2 | null
  currentWord: string
  message: string
}

const WordBattle: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    letters: [],
    player1Words: [],
    player2Words: [],
    currentPlayer: 1,
    timeLeft: 180, // 3 minutes
    gameActive: false,
    gameOver: false,
    scores: { player1: 0, player2: 0 },
    winner: null,
    currentWord: '',
    message: ''
  })

  // Using comprehensive word list from external file

  // Generate random letters
  const generateLetters = (): string[] => {
    const vowels = ['A', 'E', 'I', 'O', 'U']
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
    const letters: string[] = []
    
    // Ensure at least 3 vowels
    for (let i = 0; i < 3; i++) {
      letters.push(vowels[Math.floor(Math.random() * vowels.length)])
    }
    
    // Add 9 more letters (mix of vowels and consonants)
    for (let i = 0; i < 9; i++) {
      const useVowel = Math.random() < 0.3
      if (useVowel) {
        letters.push(vowels[Math.floor(Math.random() * vowels.length)])
      } else {
        letters.push(consonants[Math.floor(Math.random() * consonants.length)])
      }
    }
    
    return letters.sort(() => Math.random() - 0.5)
  }

  // Check if word can be formed from available letters
  const canFormWord = (word: string, availableLetters: string[]): boolean => {
    const letterCount: { [key: string]: number } = {}
    
    // Count available letters
    availableLetters.forEach(letter => {
      letterCount[letter] = (letterCount[letter] || 0) + 1
    })
    
    // Check if word can be formed
    for (const letter of word.toUpperCase()) {
      if (!letterCount[letter] || letterCount[letter] === 0) {
        return false
      }
      letterCount[letter]--
    }
    
    return true
  }

  // Calculate word score
  const calculateScore = (word: string): number => {
    const baseScore = word.length
    const bonusMultiplier = word.length >= 6 ? 2 : word.length >= 4 ? 1.5 : 1
    return Math.floor(baseScore * bonusMultiplier)
  }

  // Submit word
  const submitWord = () => {
    const word = gameState.currentWord.toLowerCase().trim()
    
    if (word.length < 3) {
      setGameState(prev => ({ ...prev, message: 'Word must be at least 3 letters long!' }))
      return
    }
    
    if (!validWords.has(word)) {
      setGameState(prev => ({ ...prev, message: 'Not a valid English word!' }))
      return
    }
    
    if (!canFormWord(word, gameState.letters)) {
      setGameState(prev => ({ ...prev, message: 'Cannot form this word with available letters!' }))
      return
    }
    
    const currentPlayerWords = gameState.currentPlayer === 1 ? gameState.player1Words : gameState.player2Words
    if (currentPlayerWords.includes(word)) {
      setGameState(prev => ({ ...prev, message: 'Word already used!' }))
      return
    }
    
    // Check if opponent already used this word
    const opponentWords = gameState.currentPlayer === 1 ? gameState.player2Words : gameState.player1Words
    if (opponentWords.includes(word)) {
      setGameState(prev => ({ ...prev, message: 'Opponent already used this word!' }))
      return
    }
    
    const score = calculateScore(word)
    const newScores = { ...gameState.scores }
    
    if (gameState.currentPlayer === 1) {
      newScores.player1 += score
      setGameState(prev => ({
        ...prev,
        player1Words: [...prev.player1Words, word],
        scores: newScores,
        currentWord: '',
        message: `+${score} points!`,
        currentPlayer: 2
      }))
    } else {
      newScores.player2 += score
      setGameState(prev => ({
        ...prev,
        player2Words: [...prev.player2Words, word],
        scores: newScores,
        currentWord: '',
        message: `+${score} points!`,
        currentPlayer: 1
      }))
    }
    
    setTimeout(() => {
      setGameState(prev => ({ ...prev, message: '' }))
    }, 2000)
  }

  // Start game
  const startGame = () => {
    const letters = generateLetters()
    setGameState({
      letters,
      player1Words: [],
      player2Words: [],
      currentPlayer: 1,
      timeLeft: 180,
      gameActive: true,
      gameOver: false,
      scores: { player1: 0, player2: 0 },
      winner: null,
      currentWord: '',
      message: ''
    })
  }

  // End game
  const endGame = () => {
    const winner = gameState.scores.player1 > gameState.scores.player2 ? 1 :
                   gameState.scores.player2 > gameState.scores.player1 ? 2 : null
    
    setGameState(prev => ({
      ...prev,
      gameActive: false,
      gameOver: true,
      winner
    }))
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      letters: [],
      player1Words: [],
      player2Words: [],
      currentPlayer: 1,
      timeLeft: 180,
      gameActive: false,
      gameOver: false,
      scores: { player1: 0, player2: 0 },
      winner: null,
      currentWord: '',
      message: ''
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
      endGame()
    }
    return () => clearTimeout(timer)
  }, [gameState.gameActive, gameState.timeLeft])

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-6xl mx-auto">
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
                <Puzzle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.gameActive ? `Player ${gameState.currentPlayer}'s Turn` : 'Word Battle'}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Score - Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}
              </p>
              {gameState.gameActive && (
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className={`font-bold ${
                    gameState.timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatTime(gameState.timeLeft)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            {!gameState.gameActive && !gameState.gameOver ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Word Battle
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create words from the given letters. Longer words score more points!
                </p>
                <button
                  onClick={startGame}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Puzzle className="h-5 w-5" />
                  <span>Start Game</span>
                </button>
              </div>
            ) : (
              <div>
                {/* Available Letters */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Available Letters
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {gameState.letters.map((letter, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-center text-xl font-bold text-blue-800 dark:text-blue-200"
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Word Input */}
                {gameState.gameActive && (
                  <div className="mb-6">
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        value={gameState.currentWord}
                        onChange={(e) => setGameState(prev => ({ ...prev, currentWord: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && submitWord()}
                        className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Type your word..."
                        autoFocus
                      />
                      <button
                        onClick={submitWord}
                        className="w-full mt-3 btn-primary"
                      >
                        Submit Word
                      </button>
                    </div>
                    
                    {gameState.message && (
                      <div className={`text-center mt-3 font-bold ${
                        gameState.message.includes('points') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {gameState.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="flex justify-center">
                  <button
                    onClick={resetGame}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>New Game</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Words Lists */}
        <div className="space-y-6">
          {/* Player 1 Words */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
              Player 1 Words ({gameState.scores.player1} pts)
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {gameState.player1Words.map((word, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">{word}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    +{calculateScore(word)}
                  </span>
                </div>
              ))}
              {gameState.player1Words.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No words yet</p>
              )}
            </div>
          </div>

          {/* Player 2 Words */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">
              Player 2 Words ({gameState.scores.player2} pts)
            </h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {gameState.player2Words.map((word, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 dark:text-white">{word}</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    +{calculateScore(word)}
                  </span>
                </div>
              ))}
              {gameState.player2Words.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No words yet</p>
              )}
            </div>
          </div>

          {/* Scoring Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Scoring</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• 3 letters: 3 points</p>
              <p>• 4-5 letters: 1.5x multiplier</p>
              <p>• 6+ letters: 2x multiplier</p>
              <p>• Minimum word length: 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordBattle