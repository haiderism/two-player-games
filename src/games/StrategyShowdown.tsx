import React, { useState, useEffect } from 'react'
import { RotateCcw, Target, Shield, Sword, Crown } from 'lucide-react'

type ActionType = 'attack' | 'defend' | 'charge' | 'special'

interface Action {
  type: ActionType
  name: string
  damage: number
  defense: number
  energy: number
  description: string
  icon: string
}

interface Player {
  health: number
  energy: number
  shield: number
  lastAction: ActionType | null
  chargeCount: number
}

interface GameState {
  players: { player1: Player; player2: Player }
  currentRound: number
  maxRounds: number
  gamePhase: 'setup' | 'selection' | 'reveal' | 'gameover'
  selectedActions: { player1: ActionType | null; player2: ActionType | null }
  winner: 1 | 2 | null
  battleLog: string[]
  currentPlayer: 1 | 2
  turnTimer: number
}

const StrategyShowdown: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: {
      player1: { health: 100, energy: 3, shield: 0, lastAction: null, chargeCount: 0 },
      player2: { health: 100, energy: 3, shield: 0, lastAction: null, chargeCount: 0 }
    },
    currentRound: 1,
    maxRounds: 10,
    gamePhase: 'setup',
    selectedActions: { player1: null, player2: null },
    winner: null,
    battleLog: [],
    currentPlayer: 1,
    turnTimer: 30
  })

  const actions: Record<ActionType, Action> = {
    attack: {
      type: 'attack',
      name: 'Attack',
      damage: 25,
      defense: 0,
      energy: -1,
      description: 'Deal 25 damage to opponent',
      icon: '⚔️'
    },
    defend: {
      type: 'defend',
      name: 'Defend',
      damage: 0,
      defense: 20,
      energy: 0,
      description: 'Gain 20 shield points',
      icon: '🛡️'
    },
    charge: {
      type: 'charge',
      name: 'Charge',
      damage: 0,
      defense: 0,
      energy: 2,
      description: 'Gain 2 energy points',
      icon: '⚡'
    },
    special: {
      type: 'special',
      name: 'Special Attack',
      damage: 40,
      defense: 0,
      energy: -3,
      description: 'Powerful attack that deals 40 damage',
      icon: '💥'
    }
  }

  // Start game
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'selection',
      battleLog: ['🎮 Strategy Showdown begins!', '⚔️ Choose your actions wisely!']
    }))
  }

  // Select action
  const selectAction = (player: 1 | 2, action: ActionType) => {
    // Check if player has enough energy
    const playerData = gameState.players[`player${player}`]
    const actionData = actions[action]
    
    if (playerData.energy + actionData.energy < 0) {
      return // Not enough energy
    }

    const newSelectedActions = { ...gameState.selectedActions }
    newSelectedActions[`player${player}`] = action

    setGameState(prev => ({
      ...prev,
      selectedActions: newSelectedActions
    }))

    // If both players have selected, resolve the round
    if (newSelectedActions.player1 && newSelectedActions.player2) {
      setTimeout(() => resolveRound(newSelectedActions.player1!, newSelectedActions.player2!), 1000)
    }
  }

  // Resolve round
  const resolveRound = (action1: ActionType, action2: ActionType) => {
    const newPlayers = { ...gameState.players }
    const newBattleLog = [...gameState.battleLog]
    
    newBattleLog.push(`\n🔥 Round ${gameState.currentRound} Results:`)
    newBattleLog.push(`Player 1: ${actions[action1].icon} ${actions[action1].name}`)
    newBattleLog.push(`Player 2: ${actions[action2].icon} ${actions[action2].name}`)

    // Apply energy changes
    newPlayers.player1.energy = Math.min(5, newPlayers.player1.energy + actions[action1].energy)
    newPlayers.player2.energy = Math.min(5, newPlayers.player2.energy + actions[action2].energy)

    // Apply defense (shield)
    newPlayers.player1.shield += actions[action1].defense
    newPlayers.player2.shield += actions[action2].defense

    // Update charge counts
    if (action1 === 'charge') newPlayers.player1.chargeCount++
    if (action2 === 'charge') newPlayers.player2.chargeCount++

    // Calculate damage with special interactions
    let damage1to2 = actions[action1].damage
    let damage2to1 = actions[action2].damage

    // Special attack bonus if player has charged
    if (action1 === 'special' && newPlayers.player1.chargeCount > 0) {
      damage1to2 += newPlayers.player1.chargeCount * 10
      newPlayers.player1.chargeCount = 0
      newBattleLog.push(`💫 Player 1's special attack is empowered!`)
    }
    if (action2 === 'special' && newPlayers.player2.chargeCount > 0) {
      damage2to1 += newPlayers.player2.chargeCount * 10
      newPlayers.player2.chargeCount = 0
      newBattleLog.push(`💫 Player 2's special attack is empowered!`)
    }

    // Apply damage with shield reduction
    const actualDamage1to2 = Math.max(0, damage1to2 - newPlayers.player2.shield)
    const actualDamage2to1 = Math.max(0, damage2to1 - newPlayers.player1.shield)

    newPlayers.player2.health = Math.max(0, newPlayers.player2.health - actualDamage1to2)
    newPlayers.player1.health = Math.max(0, newPlayers.player1.health - actualDamage2to1)

    // Reduce shields by damage taken
    newPlayers.player1.shield = Math.max(0, newPlayers.player1.shield - damage2to1)
    newPlayers.player2.shield = Math.max(0, newPlayers.player2.shield - damage1to2)

    // Log damage
    if (actualDamage1to2 > 0) {
      newBattleLog.push(`💥 Player 1 deals ${actualDamage1to2} damage to Player 2`)
    }
    if (actualDamage2to1 > 0) {
      newBattleLog.push(`💥 Player 2 deals ${actualDamage2to1} damage to Player 1`)
    }
    if (actualDamage1to2 === 0 && damage1to2 > 0) {
      newBattleLog.push(`🛡️ Player 2's shield blocks Player 1's attack!`)
    }
    if (actualDamage2to1 === 0 && damage2to1 > 0) {
      newBattleLog.push(`🛡️ Player 1's shield blocks Player 2's attack!`)
    }

    // Update last actions
    newPlayers.player1.lastAction = action1
    newPlayers.player2.lastAction = action2

    // Check for winner
    let winner: 1 | 2 | null = null
    if (newPlayers.player1.health <= 0 && newPlayers.player2.health <= 0) {
      winner = null // Tie
      newBattleLog.push(`🤝 It's a tie! Both players are defeated!`)
    } else if (newPlayers.player1.health <= 0) {
      winner = 2
      newBattleLog.push(`👑 Player 2 wins!`)
    } else if (newPlayers.player2.health <= 0) {
      winner = 1
      newBattleLog.push(`👑 Player 1 wins!`)
    } else if (gameState.currentRound >= gameState.maxRounds) {
      // Game ends, winner is player with more health
      if (newPlayers.player1.health > newPlayers.player2.health) {
        winner = 1
        newBattleLog.push(`👑 Player 1 wins with more health!`)
      } else if (newPlayers.player2.health > newPlayers.player1.health) {
        winner = 2
        newBattleLog.push(`👑 Player 2 wins with more health!`)
      } else {
        winner = null
        newBattleLog.push(`🤝 It's a tie! Equal health remaining!`)
      }
    }

    setGameState(prev => ({
      ...prev,
      players: newPlayers,
      battleLog: newBattleLog,
      gamePhase: winner !== null || gameState.currentRound >= gameState.maxRounds ? 'gameover' : 'selection',
      winner,
      currentRound: prev.currentRound + 1,
      selectedActions: { player1: null, player2: null },
      turnTimer: 30
    }))
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      players: {
        player1: { health: 100, energy: 3, shield: 0, lastAction: null, chargeCount: 0 },
        player2: { health: 100, energy: 3, shield: 0, lastAction: null, chargeCount: 0 }
      },
      currentRound: 1,
      maxRounds: 10,
      gamePhase: 'setup',
      selectedActions: { player1: null, player2: null },
      winner: null,
      battleLog: [],
      currentPlayer: 1,
      turnTimer: 30
    })
  }

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (gameState.gamePhase === 'selection' && gameState.turnTimer > 0) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, turnTimer: prev.turnTimer - 1 }))
      }, 1000)
    } else if (gameState.gamePhase === 'selection' && gameState.turnTimer === 0) {
      // Auto-select charge for players who didn't select
      const autoActions = { ...gameState.selectedActions }
      if (!autoActions.player1) autoActions.player1 = 'charge'
      if (!autoActions.player2) autoActions.player2 = 'charge'
      
      if (autoActions.player1 && autoActions.player2) {
        resolveRound(autoActions.player1, autoActions.player2)
      }
    }
    return () => clearTimeout(timer)
  }, [gameState.gamePhase, gameState.turnTimer])

  // Get health bar color
  const getHealthColor = (health: number) => {
    if (health > 60) return 'bg-green-500'
    if (health > 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Check if action is available
  const isActionAvailable = (player: 1 | 2, action: ActionType) => {
    const playerData = gameState.players[`player${player}`]
    return playerData.energy + actions[action].energy >= 0
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gamePhase === 'gameover' ? (
            <div className="animate-bounce-in">
              <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
                <Crown className="h-10 w-10 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.winner ? `Player ${gameState.winner} Wins!` : "It's a Tie!"}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-2">
                <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.gamePhase === 'setup' ? 'Strategy Showdown' : `Round ${gameState.currentRound}/${gameState.maxRounds}`}
                </span>
              </div>
              {gameState.gamePhase === 'selection' && (
                <p className="text-gray-600 dark:text-gray-300">
                  Time remaining: {gameState.turnTimer}s
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Player Stats */}
      {gameState.gamePhase !== 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Player 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sword className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player 1</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Health</span>
                  <span className="text-gray-900 dark:text-white">{gameState.players.player1.health}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getHealthColor(gameState.players.player1.health)}`}
                    style={{ width: `${gameState.players.player1.health}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energy: </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {'⚡'.repeat(gameState.players.player1.energy)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Shield: </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {gameState.players.player1.shield}
                  </span>
                </div>
              </div>
              
              {gameState.players.player1.chargeCount > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Charges: </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {'💫'.repeat(gameState.players.player1.chargeCount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Player 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player 2</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Health</span>
                  <span className="text-gray-900 dark:text-white">{gameState.players.player2.health}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getHealthColor(gameState.players.player2.health)}`}
                    style={{ width: `${gameState.players.player2.health}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Energy: </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {'⚡'.repeat(gameState.players.player2.energy)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Shield: </span>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    {gameState.players.player2.shield}
                  </span>
                </div>
              </div>
              
              {gameState.players.player2.chargeCount > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Charges: </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    {'💫'.repeat(gameState.players.player2.chargeCount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-8">
        {gameState.gamePhase === 'setup' ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Strategy Showdown
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A tactical battle game where strategy and timing matter. Choose your actions wisely!
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.values(actions).map((action) => (
                <div key={action.type} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-bold text-gray-900 dark:text-white">{action.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Energy: {action.energy >= 0 ? '+' : ''}{action.energy}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={startGame}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Target className="h-5 w-5" />
              <span>Start Battle</span>
            </button>
          </div>
        ) : gameState.gamePhase === 'selection' ? (
          <div>
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Choose Your Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Player 1 Actions */}
              <div>
                <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">
                  Player 1 {gameState.selectedActions.player1 ? '✓' : ''}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(actions).map((action) => (
                    <button
                      key={action.type}
                      onClick={() => selectAction(1, action.type)}
                      disabled={!isActionAvailable(1, action.type) || gameState.selectedActions.player1 !== null}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        gameState.selectedActions.player1 === action.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isActionAvailable(1, action.type) && gameState.selectedActions.player1 === null
                          ? 'border-gray-300 dark:border-gray-600 hover:border-blue-400 bg-white dark:bg-gray-700'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <div className="font-bold text-sm">{action.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Energy: {action.energy >= 0 ? '+' : ''}{action.energy}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Player 2 Actions */}
              <div>
                <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 text-center">
                  Player 2 {gameState.selectedActions.player2 ? '✓' : ''}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(actions).map((action) => (
                    <button
                      key={action.type}
                      onClick={() => selectAction(2, action.type)}
                      disabled={!isActionAvailable(2, action.type) || gameState.selectedActions.player2 !== null}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        gameState.selectedActions.player2 === action.type
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : isActionAvailable(2, action.type) && gameState.selectedActions.player2 === null
                          ? 'border-gray-300 dark:border-gray-600 hover:border-red-400 bg-white dark:bg-gray-700'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-2xl mb-2">{action.icon}</div>
                      <div className="font-bold text-sm">{action.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Energy: {action.energy >= 0 ? '+' : ''}{action.energy}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Battle Log */}
        {gameState.battleLog.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Battle Log</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
              {gameState.battleLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {(gameState.gamePhase === 'gameover' || gameState.gamePhase === 'setup') && (
          <div className="flex justify-center mt-8">
            <button
              onClick={resetGame}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Battle</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StrategyShowdown