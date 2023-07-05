const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();
let validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidPuzzle = '..9..5.1.85.411112432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
let tooShort = '..9..5.1.85.4....2432......1...69.83.9.';
let invalidCharInPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6mm';



suite('Unit Tests', () => {
  var checkIfValid = solver.validate(validPuzzle);
      test('Logic handles a valid puzzle string of 81 characters', function(done) {
            assert.equal(solver.validate(validPuzzle), true)
            done();
      });
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
            assert.equal(solver.validate(invalidCharInPuzzle), false)
            done();
      });
        test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
            assert.equal(solver.validate(tooShort).error, 'Expected puzzle to be 81 characters long' )
            done();
      });
        test('Logic handles a valid row placement', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkRowPlacement = solver.checkRowPlacement(board,'0','0',7)
              assert.equal(checkRowPlacement, true)
              done();
      });
        test('Logic handles an invalid row placement', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkRowPlacement = solver.checkRowPlacement(board,'0','3',5)
              assert.equal(checkRowPlacement, false)
              done();
        });
          test('Logic handles a valid column placement', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkColPlacement = solver.checkColPlacement(board,'0','0',7)
              assert.equal(checkColPlacement, true)
              done();
      });
        test('Logic handles an invalid column placement', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkColPlacement = solver.checkColPlacement(board,'0','0',8)
              assert.equal(checkColPlacement, false)
              done();
        });
            test('Logic handles a valid region (3x3 grid) placement', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkRegionPlacement = solver.checkRegionPlacement(board,'0','0',7)
              assert.equal(checkRegionPlacement, undefined)
              done();
      });
        test('Logic handles an invalid region (3x3 grid) placementt', function(done) {
              let board = solver.makeBoard(validPuzzle)
              let checkRegionPlacement = solver.checkRegionPlacement(board,'0','0',8)          
              assert.equal(checkRegionPlacement, false)
              done();
        });
        test('Valid puzzle strings pass the solver', function(done) {
              let solveThePuzzle = solver.solve(validPuzzle)
              let boardstr = solveThePuzzle.join('').split(',').join('');
              assert.equal(boardstr, solution)
              done();
        });
          test('Invalid puzzle strings fail the solver', function(done) {
              let solveThePuzzle = solver.solve(invalidPuzzle)
              let boardstr = solveThePuzzle.join('').split(',').join('');
              assert.isTrue(boardstr.includes("."))
              done();
        });
          test('Solver returns the expected solution for an incomplete puzzle', function(done) {
              let board = solver.makeBoard(invalidPuzzle)
              let solveThePuzzle = solver.solve(invalidPuzzle)
              let boardstr = solveThePuzzle.join('').split(',').join('');
              assert.equal(boardstr, invalidPuzzle)
            
              done();
        });

});
