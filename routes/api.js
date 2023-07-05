'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  //regex to split coordinates 
  var CoordRgx = /([a-i])|([1-9])/gi;
  

  app.route('/api/check')
    .post((req, res) => {

    //define puzzle, coord, value
    let puzzleString = req.body.puzzle;
    let coordinateString = req.body.coordinate;
    let valueString = req.body.value;

    //check if smth missing
    if (!puzzleString || !coordinateString || !valueString)
      return res.json({ error: "Required field(s) missing" });

    //check if puzzle string is valid
    var checkIfValid = solver.validate(puzzleString);
      
    //if puzzle is invalid return error
    if(checkIfValid == false)
      return res.json({ error: 'Invalid characters in puzzle' })

    if(checkIfValid.error == 'Expected puzzle to be 81 characters long')
      return res.json({error: 'Expected puzzle to be 81 characters long'})

    //if coordinate is 'A10' len is > 2, so the coord is invalid, or coord not provided at all
    if(coordinateString.length > 2 || coordinateString == undefined)
      return res.json({ error: 'Invalid coordinate'})

    //coordinates to uppercase, to have the same starting charcode
    if(coordinateString)
      coordinateString = coordinateString.toUpperCase();
    
    //CoordRgx divides input into two parts
    var row = coordinateString.match(CoordRgx)[0]
    var column = coordinateString.match(CoordRgx)[1]
    
    console.log({column,row})
    console.log({puzzleString,coordinateString,valueString})
      

    //if coordinate is invalid or pointing to non-existing grid sell return error
    if(row == undefined || column == undefined)
      return res.json({ error: 'Invalid coordinate'})

    //posted value checker 
    if(req.body.value < 1 || req.body.value > 9 || isNaN(req.body.value))
      return res.json({ error: 'Invalid value' })
    
    //char to int
    var rowChar = coordinateString[0].charCodeAt(0);
    //set starter column as 0 instead of posted 1
    column = column - 1;
    //UpperCase A in ascii is = 65
    row = rowChar - 65;

    //make the board and check if valid
    let board = solver.makeBoard(puzzleString)
    let checkRowPlacement = solver.checkRowPlacement(board,row,column,valueString)
    let checkColPlacement = solver.checkColPlacement(board,row,column,valueString)
    let checkRegionPlacement = solver.checkRegionPlacement(board,row,column,valueString)


    //init empty arr for conflicts 
    let conflictsArr = []

    if(checkRowPlacement === false)
      conflictsArr.push('row')
    
    if(checkColPlacement === false)
      conflictsArr.push('column')
          
    if(checkRegionPlacement === false)
      conflictsArr.push('region')

    //if no conflicts(conflictsarr.len == 0) valid : true
    if(conflictsArr.length == 0 || checkRegionPlacement)
      return res.json({valid: true})
    else
      return res.json({ "valid": false, "conflict": conflictsArr })
    
    
  });
    
  app.route('/api/solve')
    .post((req, res) => {
      var puzzleString = req.body.puzzle;  

      var checkIfValid = solver.validate(puzzleString);

      //console.log({checkIfValid})
      
      //if puzzle is invalid return error
      if(checkIfValid == false)
        return res.json({ error: 'Invalid characters in puzzle' })

      if(!req.body.puzzle || puzzleString === undefined)
        return res.json({ error: 'Required field missing' })
      
      if(checkIfValid.error == 'Expected puzzle to be 81 characters long')
        return res.json({error: 'Expected puzzle to be 81 characters long'})

      let solveThePuzzle = solver.solve(puzzleString)
      let board = solveThePuzzle.join('').split(',').join('');

      if(board.includes("."))
        return res.json({ error: 'Puzzle cannot be solved' })
      else
        return res.json({"solution":board})
      
      
    });
};
