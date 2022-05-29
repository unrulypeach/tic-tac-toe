const gameBoard = (() => {
  function newBoard(aBoard) {
    for (let out=0; out<3; out++) {
      for (let ins = 0; ins<3; ins++ ) {
        aBoard[out][ins] = null
      }
    }
  }
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
    selectedId.classList.remove('dim')
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
      let p1x = Object.create(playerFactory('X', 0));
      let bot = Object.create(ai('O', 1));

      game.setPlayer(bot, 2)
      game.setPlayer(p1x, 1)
      //(piece, playerTurnNum)
      const p1 = game.returnPlayer(1);
      const p11 = game.returnPlayerPiece(p1);
      const p12 = game.returnPlayerTurnNum(p1);
      p1x.initEl( p11, p12)

      dimUnselected(playerOneX)
    })
    playerOneO.addEventListener('click', function(){
      let p1o = Object.create(playerFactory('O', 1))
      game.setPlayer(p1o, 1)
      const p1 = game.returnPlayer(1);
      const p11 = game.returnPlayerPiece(p1);
      const p12 = game.returnPlayerTurnNum(p1);
      p1o.initEl( p11, p12)

      const bot = Object.create(ai('X', 0))
      game.setPlayer(bot, 1)

      dimUnselected(playerOneO)
    })
    playerTwoX.addEventListener('click', function(){
      let p2x = Object.create(playerFactory('X', 1))
      game.setPlayer(p2x, 2)
      const p2 = game.returnPlayer(2);
      const p21 = game.returnPlayerPiece(p2);
      const p22 = game.returnPlayerTurnNum(p2);
      p2x.initEl( p21, p22)
      dimUnselected(playerTwoX)
    })
    playerTwoO.addEventListener('click', function(){
      let p2o = Object.create(playerFactory('O', 1))
      game.setPlayer(p2o, 2)
      const p2 = game.returnPlayer(2);
      const p21 = game.returnPlayerPiece(p2);
      const p22 = game.returnPlayerTurnNum(p2);
      p2o.initEl( p21, p22)
      dimUnselected(playerTwoO)
    })
  }
  function openHelp(){
    const helpBut = document.getElementById('help')
    helpBut.addEventListener('click', e => {
      const helpMenu = document.getElementById('helpMenu')
      helpMenu.classList.add('helpOn')
      closeHelp()
      e.stopImmediatePropagation()
    })
  }
  function closeHelp(){
    document.addEventListener('click', function(){
      const helpMenu = document.getElementById('helpMenu')
      helpMenu.classList.remove('helpOn')
    })
  }
  function resetMenuSettings(){
    const buttonClassNode = document.getElementsByClassName('playerOpts')
    for (let i = 0; i<4; i++) {
      const currentIt = buttonClassNode[i]
      currentIt.classList.remove('dim')
    }
  }
  (() => {
    const pOne = document.getElementById("pOne")
    const pTwo = document.getElementById('pTwo');
    pOne.addEventListener('click', function(e){
      initPlayerSelection('p1menu')
    });
    pTwo.addEventListener('click', function(e){
      initPlayerSelection('p2menu')
    });
    openHelp()
    createPlayer()
  })();
  return {
    getRowIds,
    renderBoard,
    newBoard,
    resetMenuSettings
  }
})();
const counter = (function() {
  let turnCounter = 0;

  function changeBy(val) {
    turnCounter += val;
  }
  function reset() {
    turnCounter = 0;
  }
  return {
    increment: function(){
      changeBy(1);
    },
    decrement: function(){
      changeBy(-1);
    },
    value: function(){
      console.log(turnCounter)
      return turnCounter;
    },
    reset
  }
})();
const game = (() => {
  let board = [ 
    [ null, null, null],
    [ null, null, null],
    [ null, null, null]
  ]
  let player1 = null;
  let player2 = null;

  function setPlayer( playerObj, playerNum) {
    if (playerNum == 1) {
      player1 = playerObj
    } else {
      player2 = playerObj
    }
  }
  function resetPlayers() {
    game.player1 = null;
    game.player2 = null;
  }
  function returnPlayer(num){
    if (num == 1) {
      console.log(player1)    
      return player1
    } else {
      console.log(player2)
      return player2
    }
  }
  function returnPlayerTurnNum(playerNum){
    return playerNum.playerTurnNum
  }
  function returnPlayerPiece(playerNum){
    return playerNum.piece
  }
  (() => {
    //connect restart button
    const restartBut = document.getElementById('restart')
    restartBut.addEventListener('click', newGame)
  })();
  function newGame() {
    gameBoard.newBoard(board)
    gameBoard.renderBoard(board)
    cloneRemoveEvLis()
    counter.reset()
    hideWinner()
    player1 = null
    player2 = null
    gameBoard.resetMenuSettings()
  }
  //location is each square's id && player is x or o mark
  function changeBoard(location, playerPiece) {
    const rowNum = parseInt(location[0])
    const colNum = parseInt(location[1])

    board[rowNum][colNum] = playerPiece
    
    gameBoard.renderBoard(board)

    if ((counter.value()) === 0) {
      counter.increment()
    } else {
      counter.decrement()
    }
  }
  function initEvLis(piece, yourTurnNum) {
    const board = document.getElementById('board')
    board.addEventListener('click', e => {

      if(yourTurnNum == counter.value()){

        changeBoard(e.target.id, piece)
        checkWinCon()

        if( (returnPlayer(2).bot) ==  true) {
          playRand()
          checkWinCon()

        }
        e.stopImmediatePropagation()
      }
    })
  }
  function cloneRemoveEvLis() {
    const boardElement= document.getElementById('board')
    const newBoardElement = boardElement.cloneNode(true);
    boardElement.parentNode.replaceChild(newBoardElement, boardElement)
  }
  function displayWinner (piece) {
    const phraseBox = document.getElementById('winningPhrase')
    const winPhrase = `${piece} WINS`
    phraseBox.innerText = winPhrase
    
    const theBoard = document.getElementById('winner')
    theBoard.classList.add('on')
  }
  function hideWinner() {
    const theBoard = document.getElementById('winner')
    theBoard.classList.remove('on')
  }
  function playRand() {
    const random1 = Math.floor(Math.random()*3);
    const random2 = Math.floor(Math.random()*3)
    if (board[random1][random2] === null){
      changeBoard((`${random1}${random2}`), player2.piece)
    } else {
      playRand()
    }
  }
  function checkWinCon(){
    //horizontal line --ie. [0][0]-[0][1]-[0][2]
    for (let row=0; row<3; row++) {
      const compare = board[row][2]
      let counter = 0
      for (let col=0; col<3; col++) {
        if (compare === board[row][col] && compare != null){
          counter += 1
        } else {
          break 
        }
        if (counter >= 2) {
          displayWinner(compare)
        }
      }
    }
    // vertical line --ie. [0][0]-[1][0]-[2][0]
    for (let col in board) {
      const thirdCell = board[2][col]
      let counter = 0
      for (let row in board) {
        if (thirdCell === board[row][col] && thirdCell != null){
          counter += 1
        } else {
          break
        }
        if (counter >= 2) {
          displayWinner(thirdCell)
        }
      }
    }
    // //diagonal line (NotWork)-- [0][0]-[1][1]-[2][2] & [0][2]-[1][1]-[2][0] [up][up] & [up][down]
    for (let row in board) {
      const currCell = board[row][row]
      if (currCell != board[2][2] || currCell === null) {
        break
      } else {
        displayWinner(currCell)
      }
    }

    if (board[0][2] != null && board[0][2] === board[1][1] && board[0][2] === board [2][0]) {
      displayWinner(board[0][2])
    }
  }
  return {
    board,  
    setPlayer,
    resetPlayers,
    returnPlayer,
    returnPlayerPiece,
    returnPlayerTurnNum,
    newGame,
    initEvLis
  }
})();

const playerFactory = (piece, playerTurnNum) => {
  
  function initEl(piece, playerTurnNum) {
    game.initEvLis(piece, playerTurnNum)
  }

  return {
    bot:false,
    piece,
    playerTurnNum,
    initEl
  }
}

const ai = (piece, turnNum) => {

  return { 
    bot: true,
    piece,
    turnNum
  }
}

