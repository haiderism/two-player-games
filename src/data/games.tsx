import React from 'react'
import {
  Hash,
  Circle,
  Crown,
  Scissors,
  Target,
  Zap,
  Brain,
  Puzzle,
  Dice6,
  Trophy,
} from 'lucide-react'

export interface Game {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  players: number
  rules: string[]
  howToPlay: string
}

export const games: Game[] = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game. Get three in a row to win!',
    icon: <Hash className="h-8 w-8" />,
    difficulty: 'Easy',
    estimatedTime: '2-5 min',
    players: 2,
    rules: [
      'Players take turns placing X or O on a 3x3 grid',
      'First player to get 3 in a row (horizontal, vertical, or diagonal) wins',
      'If all 9 squares are filled without a winner, it\'s a tie',
    ],
    howToPlay: 'Click on any empty square to place your mark. Try to get three of your marks in a row while blocking your opponent!',
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Drop discs and connect four in a row to claim victory!',
    icon: <Circle className="h-8 w-8" />,
    difficulty: 'Medium',
    estimatedTime: '5-10 min',
    players: 2,
    rules: [
      'Players take turns dropping colored discs into a 7x6 grid',
      'Discs fall to the lowest available space in the chosen column',
      'First player to connect four discs in a row wins',
      'Connections can be horizontal, vertical, or diagonal',
    ],
    howToPlay: 'Click on a column to drop your disc. Plan ahead and try to connect four while blocking your opponent!',
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'The ultimate strategy game with full chess rules and elegant design.',
    icon: <Crown className="h-8 w-8" />,
    difficulty: 'Hard',
    estimatedTime: '15-45 min',
    players: 2,
    rules: [
      'Full chess with all traditional pieces and rules',
      'Each piece moves according to standard chess rules',
      'Put the opponent\'s King in checkmate to win',
      'Pawns automatically promote to Queens at the end',
      'Check and checkmate detection included',
    ],
    howToPlay: 'Click on a piece to select it and see possible moves highlighted in green. Click on a green square to move. Protect your king and capture the opponent\'s pieces!',
   },
   {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'The timeless hand game. Best of 5 rounds wins!',
    icon: <Scissors className="h-8 w-8" />,
    difficulty: 'Easy',
    estimatedTime: '1-3 min',
    players: 2,
    rules: [
      'Rock beats Scissors',
      'Scissors beats Paper',
      'Paper beats Rock',
      'Best of 5 rounds wins the match',
    ],
    howToPlay: 'Choose Rock, Paper, or Scissors. Make your choice quickly and see who wins each round!',
  },
  {
    id: 'dots-and-boxes',
    title: 'Dots and Boxes',
    description: 'Connect dots to form boxes and claim territory!',
    icon: <Target className="h-8 w-8" />,
    difficulty: 'Medium',
    estimatedTime: '10-15 min',
    players: 2,
    rules: [
      'Players take turns drawing lines between dots',
      'When a player completes a box, they claim it and get another turn',
      'Player with the most boxes when all lines are drawn wins',
    ],
    howToPlay: 'Click between two adjacent dots to draw a line. Complete boxes to score points!',
  },
  {
    id: 'lightning-rounds',
    title: 'Lightning Rounds',
    description: 'Quick-fire mini-games with time pressure!',
    icon: <Zap className="h-8 w-8" />,
    difficulty: 'Medium',
    estimatedTime: '3-7 min',
    players: 2,
    rules: [
      'Series of quick mini-games with 30-second time limits',
      'Games include pattern matching, quick math, and reaction tests',
      'Player with the most wins across all rounds is the champion',
    ],
    howToPlay: 'React quickly to each challenge. Speed and accuracy are key to victory!',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Flip cards and find matching pairs. Test your memory!',
    icon: <Brain className="h-8 w-8" />,
    difficulty: 'Easy',
    estimatedTime: '5-8 min',
    players: 2,
    rules: [
      'Cards are placed face down in a grid',
      'Players take turns flipping two cards',
      'If cards match, player keeps them and goes again',
      'Player with the most pairs when all cards are matched wins',
    ],
    howToPlay: 'Click on two cards to flip them. Remember where cards are located to make matches!',
  },
  {
    id: 'word-battle',
    title: 'Word Battle',
    description: 'Create words from letters and outscore your opponent!',
    icon: <Puzzle className="h-8 w-8" />,
    difficulty: 'Medium',
    estimatedTime: '8-12 min',
    players: 2,
    rules: [
      'Players are given the same set of random letters',
      'Create as many valid words as possible within the time limit',
      'Longer words score more points',
      'Player with the highest total score wins',
    ],
    howToPlay: 'Type words using the available letters. Longer and more complex words give higher scores!',
  },
  {
    id: 'number-duel',
    title: 'Number Duel',
    description: 'Mathematical challenges and number puzzles await!',
    icon: <Dice6 className="h-8 w-8" />,
    difficulty: 'Medium',
    estimatedTime: '6-10 min',
    players: 2,
    rules: [
      'Solve math problems and number puzzles faster than your opponent',
      'Questions range from basic arithmetic to logic puzzles',
      'First to answer correctly gets the point',
      'Best of 10 questions wins',
    ],
    howToPlay: 'Read each question carefully and enter your answer quickly. Accuracy and speed both matter!',
  },
  {
    id: 'strategy-showdown',
    title: 'Strategy Showdown',
    description: 'Ultimate test of tactical thinking and planning!',
    icon: <Trophy className="h-8 w-8" />,
    difficulty: 'Hard',
    estimatedTime: '15-25 min',
    players: 2,
    rules: [
      'Turn-based strategy game on a hexagonal grid',
      'Capture territory and resources to build your army',
      'Use different unit types with unique abilities',
      'Eliminate all enemy units or capture their base to win',
    ],
    howToPlay: 'Plan your moves carefully. Manage resources, position units strategically, and adapt to your opponent\'s tactics!',
  },
]

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id)
}