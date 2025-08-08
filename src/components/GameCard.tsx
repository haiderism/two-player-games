import React from 'react'
import { Link } from 'react-router-dom'
import { Play, Users } from 'lucide-react'

interface GameCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  players: number
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
  icon,
  difficulty,
  estimatedTime,
  players,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <Link to={`/game/${id}`} className="block group">
      <div className="game-card p-6 h-full animate-fade-in">
        {/* Game Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
          <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Game Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Game Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center leading-relaxed">
          {description}
        </p>

        {/* Game Info */}
        <div className="space-y-3">
          {/* Difficulty & Time */}
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ~{estimatedTime}
            </span>
          </div>

          {/* Players */}
          <div className="flex items-center justify-center space-x-1 text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span className="text-xs">{players} Players</span>
          </div>

          {/* Play Button */}
          <div className="pt-2">
            <div className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Play Now</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GameCard