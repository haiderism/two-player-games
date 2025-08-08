import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Users, Clock, Info, Play } from 'lucide-react'
import { getGameById } from '../data/games'
import TicTacToe from '../games/TicTacToe'
import ConnectFour from '../games/ConnectFour'
import RockPaperScissors from '../games/RockPaperScissors'
import MemoryMatch from '../games/MemoryMatch'
import Chess from '../games/Chess'
import DotsAndBoxes from '../games/DotsAndBoxes'
import LightningRounds from '../games/LightningRounds'
import WordBattle from '../games/WordBattle'
import NumberDuel from '../games/NumberDuel'
import StrategyShowdown from '../games/StrategyShowdown'

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const [showRules, setShowRules] = useState(false)
  const [gameKey, setGameKey] = useState(0) // For restarting games
  
  const game = gameId ? getGameById(gameId) : null

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Game Not Found
          </h1>
          <Link to="/" className="btn-primary">
            Back to Games
          </Link>
        </div>
      </div>
    )
  }

  const handleRestart = () => {
    setGameKey(prev => prev + 1)
  }

  const renderGame = () => {
    switch (gameId) {
      case 'tic-tac-toe':
        return <TicTacToe key={gameKey} />
      case 'connect-four':
        return <ConnectFour key={gameKey} />
      case 'rock-paper-scissors':
        return <RockPaperScissors key={gameKey} />
      case 'memory-match':
        return <MemoryMatch key={gameKey} />
      case 'chess':
        return <Chess key={gameKey} />
      case 'dots-and-boxes':
        return <DotsAndBoxes key={gameKey} />
      case 'lightning-rounds':
        return <LightningRounds key={gameKey} />
      case 'word-battle':
        return <WordBattle key={gameKey} />
      case 'number-duel':
        return <NumberDuel key={gameKey} />
      case 'strategy-showdown':
        return <StrategyShowdown key={gameKey} />
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8 text-center">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {game.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This game is coming soon! We're working hard to bring you an amazing experience.
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <Play className="h-5 w-5" />
              <span className="font-medium">Coming Soon</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Games</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRules(!showRules)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>Rules</span>
            </button>
            <button
              onClick={handleRestart}
              className="btn-primary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-blue-600 dark:text-blue-400">
              {game.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {game.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {game.description}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4" />
              <span>{game.players} Players</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{game.estimatedTime}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              game.difficulty === 'Easy'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : game.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
              {game.difficulty}
            </span>
          </div>
        </div>

        {/* Rules Panel */}
        {showRules && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8 animate-slide-up">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Play
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {game.howToPlay}
            </p>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Rules:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {game.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Game Area */}
        <div className="animate-fade-in">
          {renderGame()}
        </div>
      </div>
    </div>
  )
}

export default GamePage