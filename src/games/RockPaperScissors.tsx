import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Scissors } from 'lucide-react'

type Choice = 'rock' | 'paper' | 'scissors' | null
type RoundResult = 'player1' | 'player2' | 'tie'

interface GameState {
  player1Choice: Choice
  player2Choice: Choice
  roundResult: RoundResult | null
  scores: { player1: number; player2: number; ties: number }
  gameWinner: 'player1' | 'player2' | null
  round: number
  showResult: boolean
}

const RockPaperScissors: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player1Choice: null,
    player2Choice: null,
    roundResult: null,
    scores: { player1: 0, player2: 0, ties: 0 },
    gameWinner: null,
    round: 1,
    showResult: false,
  })
  
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const [countdown, setCountdown] = useState<number | null>(null)

  const choices = [
    { id: 'rock', name: 'Rock', emoji: '🪨', icon: '✊' },
    { id: 'paper', name: 'Paper', emoji: '📄', icon: '✋' },
    { id: 'scissors', name: 'Scissors', emoji: '✂️', icon: '✌️' },
  ]

  const getWinner = (choice1: Choice, choice2: Choice): RoundResult => {
    if (!choice1 || !choice2) return 'tie'
    if (choice1 === choice2) return 'tie'
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    }
    
    return winConditions[choice1 as keyof typeof winConditions] === choice2 ? 'player1' : 'player2'
  }

  const makeChoice = (choice: Choice) => {
    if (currentPlayer === 1) {
      setGameState(prev => ({ ...prev, player1Choice: choice }))
      setCurrentPlayer(2)
    } else {
      setGameState(prev => ({ ...prev, player2Choice: choice }))
      
      // Start countdown when both players have chosen
      setCountdown(3)
    }
  }

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      // Reveal results
      const result = getWinner(gameState.player1Choice, gameState.player2Choice)
      const newScores = { ...gameState.scores }
      
      if (result === 'player1') newScores.player1++
      else if (result === 'player2') newScores.player2++
      else newScores.ties++
      
      const gameWinner = newScores.player1 === 3 ? 'player1' : 
                        newScores.player2 === 3 ? 'player2' : null
      
      setGameState(prev => ({
        ...prev,
        roundResult: result,
        scores: newScores,
        gameWinner,
        showResult: true,
      }))
      
      setCountdown(null)
    }
  }, [countdown, gameState.player1Choice, gameState.player2Choice, gameState.scores])

  const nextRound = () => {
    if (gameState.gameWinner) return
    
    setGameState(prev => ({
      ...prev,
      player1Choice: null,
      player2Choice: null,
      roundResult: null,
      round: prev.round + 1,
      showResult: false,
    }))
    setCurrentPlayer(1)
  }

  const resetGame = () => {
    setGameState({
      player1Choice: null,
      player2Choice: null,
      roundResult: null,
      scores: { player1: 0, player2: 0, ties: 0 },
      gameWinner: null,
      round: 1,
      showResult: false,
    })
    setCurrentPlayer(1)
    setCountdown(null)
  }

  const getChoiceDisplay = (choice: Choice) => {
    if (!choice) return '❓'
    const choiceObj = choices.find(c => c.id === choice)
    return choiceObj?.icon || '❓'
  }

  const getResultMessage = () => {
    if (!gameState.roundResult) return ''
    
    switch (gameState.roundResult) {
      case 'player1':
        return 'Player 1 wins this round!'
      case 'player2':
        return 'Player 2 wins this round!'
      case 'tie':
        return "It's a tie!"
      default:
        return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gameWinner ? (
            <div className="animate-bounce-in">
              <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.gameWinner === 'player1' ? 'Player 1' : 'Player 2'} Wins the Game!
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                First to win 3 rounds takes the victory!
              </p>
            </div>
          ) : countdown !== null ? (
            <div className="animate-pulse">
              <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {countdown || 'REVEAL!'}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {countdown > 0 ? 'Get ready...' : 'Here are the results!'}
              </p>
            </div>
          ) : gameState.showResult ? (
            <div className="animate-fade-in">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {getResultMessage()}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Round {gameState.round} complete
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Round {gameState.round} - Best of 5
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {currentPlayer === 1 ? 'Player 1' : 'Player 2'}, make your choice!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        {gameState.showResult ? (
          /* Results Display */
          <div className="text-center">
            <div className="flex justify-center items-center space-x-8 mb-8">
              {/* Player 1 */}
              <div className="text-center">
                <div className="text-6xl mb-2 animate-bounce-in">
                  {getChoiceDisplay(gameState.player1Choice)}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Player 1
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {gameState.player1Choice}
                </div>
              </div>
              
              {/* VS */}
              <div className="text-4xl font-bold text-gray-400 dark:text-gray-500">
                VS
              </div>
              
              {/* Player 2 */}
              <div className="text-center">
                <div className="text-6xl mb-2 animate-bounce-in" style={{ animationDelay: '0.1s' }}>
                  {getChoiceDisplay(gameState.player2Choice)}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  Player 2
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {gameState.player2Choice}
                </div>
              </div>
            </div>
            
            {!gameState.gameWinner && (
              <button
                onClick={nextRound}
                className="btn-primary text-lg px-8 py-3"
              >
                Next Round
              </button>
            )}
          </div>
        ) : countdown === null ? (
          /* Choice Selection */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => makeChoice(choice.id as Choice)}
                  disabled={(
                    (currentPlayer === 1 && gameState.player1Choice !== null) ||
                    (currentPlayer === 2 && gameState.player2Choice !== null)
                  )}
                  className="group p-6 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {choice.emoji}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
                    {choice.name}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Player Status */}
            <div className="mt-8 text-center">
              <div className="flex justify-center space-x-8">
                <div className={`p-3 rounded-lg ${
                  currentPlayer === 1 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Player 1
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {gameState.player1Choice ? '✓ Ready' : 'Choosing...'}
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  currentPlayer === 2 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Player 2
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {gameState.player2Choice ? '✓ Ready' : 'Choosing...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Countdown Display */
          <div className="text-center py-12">
            <div className="text-8xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
              {countdown || '🎉'}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="btn-primary flex items-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Score (First to 3 wins)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {gameState.scores.player1}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player 1
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">
              {gameState.scores.ties}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Ties
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {gameState.scores.player2}
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

export default RockPaperScissors