import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Eye, EyeOff } from 'lucide-react'

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
  matchedBy: 1 | 2 | null
}

interface GameState {
  cards: Card[]
  currentPlayer: 1 | 2
  flippedCards: number[]
  scores: { player1: number; player2: number }
  gameOver: boolean
  winner: 1 | 2 | 'tie' | null
  canFlip: boolean
}

const MemoryMatch: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    currentPlayer: 1,
    flippedCards: [],
    scores: { player1: 0, player2: 0 },
    gameOver: false,
    winner: null,
    canFlip: true,
  })

  const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎸']
  const cardSymbols = [...symbols, ...symbols] // Duplicate for pairs

  const initializeGame = () => {
    // Shuffle the symbols
    const shuffled = [...cardSymbols].sort(() => Math.random() - 0.5)
    
    const newCards: Card[] = shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
      matchedBy: null,
    }))

    setGameState({
      cards: newCards,
      currentPlayer: 1,
      flippedCards: [],
      scores: { player1: 0, player2: 0 },
      gameOver: false,
      winner: null,
      canFlip: true,
    })
  }

  useEffect(() => {
    initializeGame()
  }, [])

  const flipCard = (cardId: number) => {
    if (!gameState.canFlip) return
    
    const card = gameState.cards[cardId]
    if (card.isFlipped || card.isMatched) return
    if (gameState.flippedCards.length >= 2) return

    const newCards = [...gameState.cards]
    newCards[cardId].isFlipped = true
    
    const newFlippedCards = [...gameState.flippedCards, cardId]
    
    setGameState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: newFlippedCards,
    }))

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setGameState(prev => ({ ...prev, canFlip: false }))
      
      setTimeout(() => {
        checkForMatch(newCards, newFlippedCards)
      }, 1000)
    }
  }

  const checkForMatch = (cards: Card[], flippedCards: number[]) => {
    const [firstCard, secondCard] = flippedCards.map(id => cards[id])
    
    if (firstCard.symbol === secondCard.symbol) {
      // Match found!
      const newCards = [...cards]
      newCards[firstCard.id].isMatched = true
      newCards[secondCard.id].isMatched = true
      newCards[firstCard.id].matchedBy = gameState.currentPlayer
      newCards[secondCard.id].matchedBy = gameState.currentPlayer
      
      const newScores = { ...gameState.scores }
      if (gameState.currentPlayer === 1) {
        newScores.player1++
      } else {
        newScores.player2++
      }
      
      // Check if game is over
      const allMatched = newCards.every(card => card.isMatched)
      let winner: 1 | 2 | 'tie' | null = null
      
      if (allMatched) {
        if (newScores.player1 > newScores.player2) winner = 1
        else if (newScores.player2 > newScores.player1) winner = 2
        else winner = 'tie'
      }
      
      setGameState(prev => ({
        ...prev,
        cards: newCards,
        flippedCards: [],
        scores: newScores,
        gameOver: allMatched,
        winner,
        canFlip: true,
        // Player gets another turn on match
      }))
    } else {
      // No match - flip cards back and switch players
      const newCards = [...cards]
      newCards[firstCard.id].isFlipped = false
      newCards[secondCard.id].isFlipped = false
      
      setGameState(prev => ({
        ...prev,
        cards: newCards,
        flippedCards: [],
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
        canFlip: true,
      }))
    }
  }

  const resetGame = () => {
    initializeGame()
  }

  const renderCard = (card: Card) => {
    const isFlipped = card.isFlipped || card.isMatched
    
    return (
      <button
        key={card.id}
        onClick={() => flipCard(card.id)}
        disabled={!gameState.canFlip || card.isFlipped || card.isMatched || gameState.gameOver}
        className={`
          aspect-square rounded-xl border-2 transition-all duration-300 transform
          ${isFlipped ? 'rotate-y-180' : ''}
          ${card.isMatched 
            ? card.matchedBy === 1 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${!card.isMatched && !card.isFlipped && gameState.canFlip && !gameState.gameOver 
            ? 'hover:scale-105 cursor-pointer' 
            : 'cursor-default'
          }
          disabled:opacity-50
        `}
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          {isFlipped ? (
            <span className="text-4xl animate-bounce-in">
              {card.symbol}
            </span>
          ) : (
            <div className="text-gray-400 dark:text-gray-500">
              <Eye className="h-8 w-8" />
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gameOver ? (
            <div className="animate-bounce-in">
              {gameState.winner === 'tie' ? (
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  It's a Tie! Great game!
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">
                    Player {gameState.winner} Wins!
                  </span>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Final Score: Player 1: {gameState.scores.player1} | Player 2: {gameState.scores.player2}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-xl text-gray-600 dark:text-gray-300">Current Player:</span>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                  gameState.currentPlayer === 1 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                  Player {gameState.currentPlayer}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Find matching pairs to score points!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Game Board */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
          {gameState.cards.map((card: Card) => renderCard(card))}
        </div>
      </div>

      {/* Game Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Cards flipped: {gameState.flippedCards.length}/2</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Pairs found: {gameState.scores.player1 + gameState.scores.player2}/8</span>
            </div>
          </div>
        </div>
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
          Scoreboard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={`text-center p-4 rounded-lg ${
            gameState.currentPlayer === 1 
              ? 'bg-blue-100 dark:bg-blue-900/20 ring-2 ring-blue-400'
              : 'bg-blue-50 dark:bg-blue-900/10'
          }`}>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {gameState.scores.player1}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player 1
            </div>
            {gameState.currentPlayer === 1 && !gameState.gameOver && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Current Turn
              </div>
            )}
          </div>
          
          <div className={`text-center p-4 rounded-lg ${
            gameState.currentPlayer === 2 
              ? 'bg-red-100 dark:bg-red-900/20 ring-2 ring-red-400'
              : 'bg-red-50 dark:bg-red-900/10'
          }`}>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {gameState.scores.player2}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Player 2
            </div>
            {gameState.currentPlayer === 2 && !gameState.gameOver && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                Current Turn
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryMatch