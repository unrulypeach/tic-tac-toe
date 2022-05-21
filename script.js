const gameBoard = (() => {
  const nBoard = [ 
    ['','',''],
    ['','',''],
    ['','','']
  ]
  function getRowIds() {
    const current = document.getElementsByClassName('board-container')[0].children
    let result = []
    for (let i = 0; i < 3; i++) { 
      result.push(current[i].id)
    }
    return result
  }
  function renderBoard(array) {
    const rowIdList = getRowIds()
  
    for (let row in array) {
      const currentRow = document.getElementById(rowIdList[row])
  
      for (let cell in array[row]){
        //matches HTML with array
        currentRow.children[cell].children[0].innerHTML = array[row][cell]
      }
    }
  }
  function newBoard() {
    return nBoard
  }
  function initPlayerSelection(butn) {
    const hiddenMenu = document.getElementById(butn)
    const className = hiddenMenu.className

    if (className.includes('menuOff')) {
      hiddenMenu.classList.remove('menuOff')
      hiddenMenu.classList.add('menuOn')
    } else {
      hiddenMenu.classList.remove('menuOn')
      hiddenMenu.classList.add('menuOff')
    }
  }
  function dimUnselected(selectedId) {
    const targNext = selectedId.nextElementSibling;
    const targBefore = selectedId.previousElementSibling;
    //check if sib is before or after (wrong one returns null)
    if (targNext != null) {
      targNext.classList.add('dim')
    } else {
      targBefore.classList.add('dim')
    }
  }
  function createPlayer(){
    const playerOneX = document.getElementById('p1x')
    const playerOneO = document.getElementById('p1o')
    const playerTwoX = document.getElementById('p2x')
    const playerTwoO = document.getElementById('p2o')

    playerOneX.addEventListener('click', function(){
      const p1x = Object.create(playerFactory('X', 0));
      p1x.initEl()
      dimUnselected(playerOneX)
    })
    playerOneO.addEventListener('click', function(){
      const p1o = Object.create(playerFactory('O', 0))
      p1o.initEl()
      dimUnselected(playerOneO)
    })
    playerTwoX.addEventListener('click', function(){
      const p2x = Object.create(playerFactory('X', 1))
      p2x.initEl()
      dimUnselected(playerTwoX)
    })
    playerTwoO.addEventListener('click', function(){
      const p2o = Object.create(playerFactory('O', 1))
      p2o.initEl()
      dimUnselected(playerTwoO)
    })
  }
  (() => {
    const pOne = document.getElementById("pOne")
    const pTwo = document.getElementById('pTwo');
    pOne.addEventListener('click', function(e){
      initPlayerSelection('p1menu')
    });
    pTwo.addEventListener('click', function(e){
      initPlayerSelection('p2menu')
    })

    createPlayer()
  })();
  return {
    getRowIds,
    renderBoard,
    newBoard
  }
})();
const counter = (function() {
  let turnCounter = 0
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function(){
      changeBy(1);
    },
    decrement: function(){
      changeBy(-1);
    },
    value: function(){
      return privateCounter
    }
  }
})();
const game = (() => {
  let board = [ 
    ['','',''],
    ['','',''],
    ['','','']
  ]
  //connect restart button
  (() => {
    const restartBut = document.getElementById('restart')
    restartBut.addEventListener('click', newGame)
  })();
  function newGame() {
    resetBoard = gameBoard.newBoard()
    board = resetBoard
    gameBoard.renderBoard(board)
    game.board = board
    game.turn = 0
  }
  //location is each square's id && player is x or o mark
  function changeBoard(location, playerPiece) {
    const rowNum = parseInt(location[0])
    const colNum = parseInt(location[1])

    board[rowNum][colNum] = playerPiece
    
    gameBoard.renderBoard(board)

    if ((counter.value()) === 0) {
      counter.increment()
      console.log(counter.value)
    } else {
      counter.decrement()
      console.log(counter.value)
    }
  }
  //add eventListeners to all grid cells when player picks a team
  function initEvLis(piece, yourTurnNum){
    for (let row in board) {
      const rowIdList = gameBoard.getRowIds()
      const currentRow = document.getElementById(rowIdList[row])

      for (let cell in board[row]) {
        const currentCell = currentRow.children[cell];

        currentCell.addEventListener('click', function(e){
          if ((counter.value()) === yourTurnNum){
            changeBoard(this.id, piece)
          }
        })
      }
    }
  }
  return {
    turn,
    newGame,
    initEvLis
  }
})();

const playerFactory = (piece, playerTurnNum) => {

  //creates eventListeners on game squares to input the
  
  function initEl() {
    game.initEvLis(piece, playerTurnNum)
  }

  function removeEl(){
    
  }

  return {
    initEl
  }
}
