import React, { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Crown, AlertTriangle } from 'lucide-react'

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
type PieceColor = 'white' | 'black'
type Square = { row: number; col: number }

interface Piece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
}

interface GameState {
  board: (Piece | null)[][]
  currentPlayer: PieceColor
  selectedSquare: Square | null
  possibleMoves: Square[]
  gameStatus: 'playing' | 'check' | 'checkmate' | 'stalemate'
  winner: PieceColor | null
  capturedPieces: { white: Piece[]; black: Piece[] }
  moveHistory: string[]
}

const Chess: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentPlayer: 'white',
    selectedSquare: null,
    possibleMoves: [],
    gameStatus: 'playing',
    winner: null,
    capturedPieces: { white: [], black: [] },
    moveHistory: []
  })

  // Chess piece Unicode symbols
  const pieceSymbols = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  }

  // Initialize chess board
  const initializeBoard = (): (Piece | null)[][] => {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    
    // Place pawns
    for (let col = 0; col < 8; col++) {
      board[1][col] = { type: 'pawn', color: 'black' }
      board[6][col] = { type: 'pawn', color: 'white' }
    }
    
    // Place other pieces
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: pieceOrder[col], color: 'black' }
      board[7][col] = { type: pieceOrder[col], color: 'white' }
    }
    
    return board
  }

  // Check if a square is within board bounds
  const isValidSquare = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8
  }

  // Get possible moves for a piece
  const getPossibleMoves = (piece: Piece, fromRow: number, fromCol: number, board: (Piece | null)[][]): Square[] => {
    const moves: Square[] = []
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1
        const startRow = piece.color === 'white' ? 6 : 1
        
        // Forward move
        if (isValidSquare(fromRow + direction, fromCol) && !board[fromRow + direction][fromCol]) {
          moves.push({ row: fromRow + direction, col: fromCol })
          
          // Double move from starting position
          if (fromRow === startRow && !board[fromRow + 2 * direction][fromCol]) {
            moves.push({ row: fromRow + 2 * direction, col: fromCol })
          }
        }
        
        // Diagonal captures
        for (const colOffset of [-1, 1]) {
          const newRow = fromRow + direction
          const newCol = fromCol + colOffset
          if (isValidSquare(newRow, newCol)) {
            const targetPiece = board[newRow][newCol]
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
        
      case 'rook':
        // Horizontal and vertical moves
        const rookDirections = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        for (const [rowDir, colDir] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * rowDir
            const newCol = fromCol + i * colDir
            if (!isValidSquare(newRow, newCol)) break
            
            const targetPiece = board[newRow][newCol]
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'bishop':
        // Diagonal moves
        const bishopDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        for (const [rowDir, colDir] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * rowDir
            const newCol = fromCol + i * colDir
            if (!isValidSquare(newRow, newCol)) break
            
            const targetPiece = board[newRow][newCol]
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'queen':
        // Combination of rook and bishop moves
        const queenDirections = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        for (const [rowDir, colDir] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = fromRow + i * rowDir
            const newCol = fromCol + i * colDir
            if (!isValidSquare(newRow, newCol)) break
            
            const targetPiece = board[newRow][newCol]
            if (!targetPiece) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (targetPiece.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'knight':
        // L-shaped moves
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ]
        for (const [rowOffset, colOffset] of knightMoves) {
          const newRow = fromRow + rowOffset
          const newCol = fromCol + colOffset
          if (isValidSquare(newRow, newCol)) {
            const targetPiece = board[newRow][newCol]
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
        
      case 'king':
        // One square in any direction
        const kingMoves = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ]
        for (const [rowOffset, colOffset] of kingMoves) {
          const newRow = fromRow + rowOffset
          const newCol = fromCol + colOffset
          if (isValidSquare(newRow, newCol)) {
            const targetPiece = board[newRow][newCol]
            if (!targetPiece || targetPiece.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
    }
    
    return moves
  }

  // Check if the king is in check
  const isInCheck = (board: (Piece | null)[][], color: PieceColor): boolean => {
    // Find the king
    let kingPos: Square | null = null
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.type === 'king' && piece.color === color) {
          kingPos = { row, col }
          break
        }
      }
      if (kingPos) break
    }
    
    if (!kingPos) return false
    
    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color !== color) {
          const moves = getPossibleMoves(piece, row, col, board)
          if (moves.some(move => move.row === kingPos!.row && move.col === kingPos!.col)) {
            return true
          }
        }
      }
    }
    
    return false
  }

  // Check if a move would put own king in check
  const wouldBeInCheck = (fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Piece | null)[][]): boolean => {
    const newBoard = board.map(row => [...row])
    const piece = newBoard[fromRow][fromCol]
    if (!piece) return false
    
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null
    
    return isInCheck(newBoard, piece.color)
  }

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameState.gameStatus !== 'playing' && gameState.gameStatus !== 'check') return
    
    const piece = gameState.board[row][col]
    
    if (gameState.selectedSquare) {
      // Check if clicking on a possible move
      const isValidMove = gameState.possibleMoves.some(
        move => move.row === row && move.col === col
      )
      
      if (isValidMove) {
        // Make the move
        makeMove(gameState.selectedSquare, { row, col })
      } else if (piece && piece.color === gameState.currentPlayer) {
        // Select new piece
        selectPiece(row, col)
      } else {
        // Deselect
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          possibleMoves: []
        }))
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      // Select piece
      selectPiece(row, col)
    }
  }

  // Select a piece and show possible moves
  const selectPiece = (row: number, col: number) => {
    const piece = gameState.board[row][col]
    if (!piece || piece.color !== gameState.currentPlayer) return
    
    const possibleMoves = getPossibleMoves(piece, row, col, gameState.board)
    // Filter out moves that would put own king in check
    const validMoves = possibleMoves.filter(
      move => !wouldBeInCheck(row, col, move.row, move.col, gameState.board)
    )
    
    setGameState(prev => ({
      ...prev,
      selectedSquare: { row, col },
      possibleMoves: validMoves
    }))
  }

  // Make a move
  const makeMove = (from: Square, to: Square) => {
    const newBoard = gameState.board.map(row => [...row])
    const piece = newBoard[from.row][from.col]
    const capturedPiece = newBoard[to.row][to.col]
    
    if (!piece) return
    
    // Update captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces }
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece)
    }
    
    // Make the move
    newBoard[to.row][to.col] = { ...piece, hasMoved: true }
    newBoard[from.row][from.col] = null
    
    // Check for pawn promotion
    if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
      newBoard[to.row][to.col] = { ...piece, type: 'queen', hasMoved: true }
    }
    
    const nextPlayer: PieceColor = gameState.currentPlayer === 'white' ? 'black' : 'white'
    
    // Check game status
    const inCheck = isInCheck(newBoard, nextPlayer)
    let gameStatus: GameState['gameStatus'] = 'playing'
    let winner: PieceColor | null = null
    
    if (inCheck) {
      // Check for checkmate
      let hasValidMoves = false
      for (let row = 0; row < 8 && !hasValidMoves; row++) {
        for (let col = 0; col < 8 && !hasValidMoves; col++) {
          const p = newBoard[row][col]
          if (p && p.color === nextPlayer) {
            const moves = getPossibleMoves(p, row, col, newBoard)
            const validMoves = moves.filter(
              move => !wouldBeInCheck(row, col, move.row, move.col, newBoard)
            )
            if (validMoves.length > 0) {
              hasValidMoves = true
            }
          }
        }
      }
      
      if (!hasValidMoves) {
        gameStatus = 'checkmate'
        winner = gameState.currentPlayer
      } else {
        gameStatus = 'check'
      }
    }
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      possibleMoves: [],
      gameStatus,
      winner,
      capturedPieces: newCapturedPieces
    }))
  }

  // Reset game
  const resetGame = () => {
    setGameState({
      board: initializeBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      possibleMoves: [],
      gameStatus: 'playing',
      winner: null,
      capturedPieces: { white: [], black: [] },
      moveHistory: []
    })
  }

  // Initialize game on component mount
  useEffect(() => {
    resetGame()
  }, [])

  // Check if square is selected
  const isSelected = (row: number, col: number): boolean => {
    return gameState.selectedSquare?.row === row && gameState.selectedSquare?.col === col
  }

  // Check if square is a possible move
  const isPossibleMove = (row: number, col: number): boolean => {
    return gameState.possibleMoves.some(move => move.row === row && move.col === col)
  }

  // Get square color (light or dark)
  const getSquareColor = (row: number, col: number): string => {
    const isLight = (row + col) % 2 === 0
    if (isSelected(row, col)) {
      return 'bg-yellow-400 dark:bg-yellow-500'
    }
    if (isPossibleMove(row, col)) {
      return isLight 
        ? 'bg-green-300 dark:bg-green-600' 
        : 'bg-green-400 dark:bg-green-700'
    }
    return isLight 
      ? 'bg-amber-100 dark:bg-amber-200' 
      : 'bg-amber-800 dark:bg-amber-900'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Game Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
        <div className="text-center">
          {gameState.gameStatus === 'checkmate' ? (
            <div className="animate-bounce-in">
              <div className="flex items-center justify-center space-x-2 text-3xl font-bold mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.winner === 'white' ? 'White' : 'Black'} Wins!
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Checkmate!</p>
            </div>
          ) : gameState.gameStatus === 'check' ? (
            <div className="animate-pulse">
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <span className="text-red-600 dark:text-red-400">Check!</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {gameState.currentPlayer === 'white' ? 'White' : 'Black'} king is in check
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-2">
                <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white">
                  {gameState.currentPlayer === 'white' ? 'White' : 'Black'} to move
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Click a piece to see possible moves
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chess Board */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
            <div className="aspect-square max-w-2xl mx-auto">
              <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 dark:border-amber-700 rounded-lg overflow-hidden">
                {gameState.board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`
                        aspect-square flex items-center justify-center text-4xl md:text-5xl
                        transition-all duration-200 hover:brightness-110
                        ${getSquareColor(rowIndex, colIndex)}
                        ${isPossibleMove(rowIndex, colIndex) ? 'ring-4 ring-green-500 ring-opacity-50' : ''}
                        ${isSelected(rowIndex, colIndex) ? 'ring-4 ring-yellow-500 ring-opacity-75' : ''}
                      `}
                      disabled={gameState.gameStatus === 'checkmate'}
                    >
                      {piece && (
                        <span className="drop-shadow-lg filter">
                          {pieceSymbols[piece.color][piece.type]}
                        </span>
                      )}
                      {isPossibleMove(rowIndex, colIndex) && !piece && (
                        <div className="w-4 h-4 bg-green-600 rounded-full opacity-60"></div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game Info Sidebar */}
        <div className="space-y-6">
          {/* Captured Pieces */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Captured</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Black</h4>
                <div className="flex flex-wrap gap-1">
                  {gameState.capturedPieces.black.map((piece, index) => (
                    <span key={index} className="text-2xl">
                      {pieceSymbols[piece.color][piece.type]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">White</h4>
                <div className="flex flex-wrap gap-1">
                  {gameState.capturedPieces.white.map((piece, index) => (
                    <span key={index} className="text-2xl">
                      {pieceSymbols[piece.color][piece.type]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Controls</h3>
            
            <button
              onClick={resetGame}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>New Game</span>
            </button>
          </div>

          {/* Game Rules */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Rules</h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>• Click a piece to select it</p>
              <p>• Green squares show possible moves</p>
              <p>• Capture opponent pieces</p>
              <p>• Protect your king from check</p>
              <p>• Checkmate wins the game</p>
              <p>• Pawns promote to queens at the end</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chess