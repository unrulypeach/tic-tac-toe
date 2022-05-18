const gameBoard = (() => {
  let board = [ 
    [ 0, 0, 0],
    [ 0, 0, 0],
    [ 0, 0, 0]
  ]
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
        const current = array[row][cell] //current cell content in given array
        currentRow.children[cell].innerHTML = current
      }
    }
  }
  function newGame() {
    const newBoard = [ 
      [ 0, 0, 0],
      [ 0, 0, 0],
      [ 0, 0, 0]
    ]

    board = newBoard

    const rowIdList = getRowIds()
  
    for (let row in newBoard) {
      const currentRow = getRow(rowIdList[row])
  
      for (let cell in newBoard[row]){
        const current = newBoard[row][cell] 
        const currentCell = currentRow.children[cell]

        currentCell.addEventListener('click', function(){ //f(n) needs to be player dependent
          currentCell.innerHTML = 'x'
        })
      }
    }
  }
  function changeBoard() {
    board[0][0] = 1
    console.log(board)
  }
  // function markBoard(player, ){}

  return {
    changeBoard,
    newGame,
    renderBoard,
  }
})();

// const playerFactory = (player) => {
//   const move = () => {
//     //mark in GB array
//   }
//   return {
//     player,
//     move
//   }
// }




