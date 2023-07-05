class SudokuSolver {


  validate(puzzleString) {
  
  var PuzzleRgx = /[1-9]|\./g;
  console.log('_______VALIDATE________')
  
  if(puzzleString != undefined){
    if(puzzleString.length != 81)
      return { error: 'Expected puzzle to be 81 characters long' }
    
    for(let i = 0; i < puzzleString.length ; i++){
      if(!puzzleString[i].match(PuzzleRgx))
        return false
    }
    return true;
  }
  


  
      
    


  }

 makeBoard(puzzleString){
    let board = [[],[],[],[],[],[],[],[],[]]
    let boardrow = -1
      for(let i=0; i < 81; i++){
        if(i % 9 === 0)
          boardrow += 1

        board[boardrow].push(puzzleString[i])
      }
   console.log('_______BOARD________')
    //console.log(board)
    return board;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    console.log({row,column})
    let board = this.makeBoard(puzzleString)
    console.log('_______ROW________')
    for(let i = 0; i < 9; i++){
      console.log('checkRowPlacement',board[row][i])
      
      if(value == board[row][i]){
        return false
      }
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    console.log('_______COLUMN________')
    console.log(column)
    let board = this.makeBoard(puzzleString)
    for(let i = 0; i < 9; i++){
      console.log('checkColPlacement',board[i][column])
      
      if(value == board[i][column]){
        return false
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
  console.log('_______CHECKREGIONPLACEMENT________')
    
  let board = this.makeBoard(puzzleString)
  
	let boxTopRow = parseInt(row / 3) * 3       // Returns index of top row of box (0, 3, or 6)
	let boxLeftColumn = parseInt(column / 3) * 3   // Returns index of left column of box (0, 3 or 6)

        if(board[row][column] == value){
          return {"valid":true}
        }
    
	let k // Looks through rows
	let l // Looks through columns
    for (k = boxTopRow; k < boxTopRow + 3; k++) {
      for(l = boxLeftColumn; l < boxLeftColumn + 3; l++){
        if(board[k][l] == value){
          if(board[row][column] == value){
            return res.json({"valid":true})
          }
          return false
        }
      }
    }
    return true
  }



  
  solve(puzzleString) {
    let board = this.makeBoard(puzzleString)
    const EMPTY = '.'
    const numarr = ['1','2','3','4','5','6','7','8','9']

    let emptySpaces = [];
    
    for(let i = 0; i<board.length; i++){
      for(let j = 0; j<board.length; j++){
        if(board[i][j] === EMPTY)
          emptySpaces.push({row: i, col: j})
        
      }
    }

    const checkIfValidPlace = (board, row, column, value) => {
      
      const puzzleString = board.join("")
      console.log({puzzleString})
      let checkColPlacement = this.checkColPlacement(puzzleString, row, column, value)
      let checkRowPlacement = this.checkRowPlacement(puzzleString, row, column, value)
      let checkRegionPlacement = this.checkRegionPlacement(puzzleString, row, column, value)

      
      let conflictsArr = []
  
      if(checkRowPlacement === false)
        conflictsArr.push('row')
      
      if(checkColPlacement === false)
        conflictsArr.push('column')
            
      if(checkRegionPlacement === false)
        conflictsArr.push('region')
      
      if(conflictsArr.length == 0 || checkRegionPlacement.valid)
        return true
      
      return false
    }

    
    function recurse(emptySpaceIndex) {
        //end
        if(emptySpaceIndex >= emptySpaces.length){
          return true
        }
        const {row,col} = emptySpaces[emptySpaceIndex];

        for(let i=0; i < numarr.length;i++){
          let num = numarr[i];

          if(checkIfValidPlace(board, row, col, num) ){
            board[row][col] = num
             if(recurse(emptySpaceIndex+1)){
               return true;
             }
            board[row][col] = EMPTY;
          }
        }
      
    }
    
    recurse(0);
    
    console.log(board)
    return board
    
  }
}

module.exports = SudokuSolver;

