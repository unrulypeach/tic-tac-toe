const gameBoard = (() => {
  const nBoard = [ 
    ['','',''],
    ['','',''],
    ['','','']
  ]
  let turn = 0
  const playerPieces = ['x', 'o'];

  function getRowIds() {
    const current = document.getElementsByClassName('board-container')[0].children
    let result = []
    for (let i = 0; i < 3; i++) { 
      result.push(current[i].id)
    }
    return result
  }
  function getRow(rowId) {
    return document.getElementById(rowId)
  }
  function renderBoard(array) {
    const rowIdList = getRowIds()
  
    for (let row in array) {
      const currentRow = getRow(rowIdList[row])
  
      for (let cell in array[row]){
        //matches HTML with array
        currentRow.children[cell].children[0].innerHTML = array[row][cell]
      }
    }
  }
  function newBoard() {
    return nBoard
  }
  return {
    getRowIds,
    getRow,
    renderBoard,
    newBoard
  }
})();

const game = (() => {
  let board = [ 
    ['','',''],
    ['','',''],
    ['','','']
  ];
  //connect restart button
  (() => {
    const restartBut = document.getElementById('restart')
    restartBut.addEventListener('click', newGame)
  })();
  //new game
  function newGame() {
    resetBoard = gameBoard.newBoard()
    board = resetBoard
    gameBoard.renderBoard(board)
    game.board = board
  }
  //location is each square's id && player is x or o mark
  function changeBoard(location, playerPiece) {
    const rowNum = parseInt(location[0])
    const colNum = parseInt(location[1])

    board[rowNum][colNum] = playerPiece
    
    gameBoard.renderBoard(board)
  }
  //add eventListeners to all grid cells when player picks a team
  function initEvLis(piece){
    const rowIdList = gameBoard.getRowIds()

    for (let row in board) {
      const currentRow = gameBoard.getRow(rowIdList[row])

      for (let cell in board[row]) {
        const currentCell = currentRow.children[cell];

        currentCell.addEventListener('click', function(e){
          changeBoard(this.id, piece)
        })
      }
    }
  }
  return {
    newGame,
    initEvLis
  }
})();


const playerFactory = (player) => {

  //pick a piece
  function pickPiece() {
  }
  //creates eventListeners on game squares to input the
  // the player = their piece
  game.initEvLis(player)
  

  return {
    player,
  }
}

const playerOne = document.getElementById('pOne')
const playerTwo = document.getElementById('pTwo')

playerOne.addEventListener('click', function(){
  Object.create(playerFactory('X'))
})
playerTwo.addEventListener('click', function(){
  Object.create(playerFactory('O'))
})

