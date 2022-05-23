const gameBoard = (() => {
  const nBoard = [ 
    [ null, null, null],
    [ null, null, null],
    [ null, null, null]
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
      game.setPlayer(p1x, 1)
      //(piece, playerTurnNum)
      const p1 = game.returnPlayer(1);
      const p11 = game.returnPlayerPiece(p1);
      const p12 = game.returnPlayerTurnNum(p1);
      p1x.initEl( p11, p12)
      //immediately create bot after P1 based off of P1 pieces
      //clicking P2 pieces would overwrite bot
      const bot = Object.create(ai('O', 1));
      game.setPlayer(bot, 2)

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
    newBoard
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
    resetBoard = gameBoard.newBoard()
    board = resetBoard
    gameBoard.renderBoard(board)
    game.board = board
    counter.reset()
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
    checkWinCon()

  }
  function initEvLis(piece, yourTurnNum){
    const board = document.getElementById('board')
    board.addEventListener('click', e => {

      if(yourTurnNum == counter.value()){

        changeBoard(e.target.id, piece)
        const p2player = returnPlayer(2)
        if( p2player.bot ==  true) {
          playRand()
        }
        // e.stopImmediatePropagation()
      }
    })
  }
  function displayWinner (piece) {
    const theBoard = document.getElementById('board')
    const newP = document.createElement('p')
    const winPhrase = `${piece} WINS`
    newP.innerText = winPhrase
    theBoard.appendChild(newP)
  }
  function playRand() {
    const random1 = Math.floor(Math.random()*3);
    const random2 = Math.floor(Math.random()*3)
    if (board[random1][random2] == null){
      changeBoard((`${random1}${random2}`), player2.piece)
    }
  }
  function checkWinCon(){
    //horizontal line --ie. [0][0]-[0][1]-[0][2]
    (() => {
      for (let row in board) {
      const thirdCell = board[row][2]
        for (let cell in board[row]) {
          const currCell = board[row][cell]
          if (currCell != thirdCell){
            // console.log('no horizontal yet')
            return
          } 
        }
        if (thirdCell != null){
          console.log(`${thirdCell} won HORIZONTAL`)
          displayWinner(thirdCell)
        }
    }
    })();
    //vertical line (NOT WORKING) --ie. [0][0]-[1][0]-[2][0] 2nd num= 0, 1, ,2 
    (() => {
      for (let row in board) {
      const thirdCell = board[2][row]
        for (let col in board) {
          const currCell = board[col][row]
          if (currCell != board[col][row]){
            console.log('no vertical yet')
            return
          }
        }
      if (thirdCell != null){ 
        console.log(`${thirdCell} won VERTICAL`)
        displayWinner(thirdCell)
      } 
      }
    })();
    //diagonal line -- [0][0]-[1][1]-[2][2] & [0][2]-[1][1]-[2][0] [up][up] & [up][down]
    (() => {
      for (let row in board) {
        const currCell = board[row][row]
        if (currCell != board[2][2]) {
          console.log('no right diag')
          return
        }
        if (currCell != null) {
          console.log(`${board[2][2]} won lrDIAGONAL`)
          displayWinner(board[2][2])
        }
      }
    })();
    (() => {
      const first = board[0][2]
      const second = board[1][1]
      const third = board [2][0]

      if (first == second && first == third) {
        if (first != null){
          console.log(`${first} won rlDIAGONAL`)
          displayWinner(first)
        }
      }
      console.log('no left diag')
    })();
  }
  return {
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
  //random
  function botMove() {

  }

  return { 
    bot: true,
    piece,
    turnNum
  }
}

