const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
let invalidPuzzle = '..9..5.1.85.411112432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
let solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
let tooShort = '..9..5.1.85.4....2432......1...69.83.9.';
let invalidCharInPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6mm';

suite('Functional Tests', () => {
    suite('SOLVE', () => {
      test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
         chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: validPuzzle
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, solution)
            done();
          });
      });
      test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
         chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: ''
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Required field missing" )
            done();
          });
      });
      test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
         chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: invalidCharInPuzzle
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle')
            done();
          });
      });
      test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
         chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: tooShort
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
            done();
          });
      });
      test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
         chai.request(server)
          .post('/api/solve')
          .send({
            puzzle: invalidPuzzle
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved' )
            done();
          });
      })
    });
    suite('CHECK', () => {
      test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
         chai.request(server)
          .post('/api/check')
          .send({
            puzzle: validPuzzle,
            coordinate: 'A1',
            value: 7
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true)
            done();
          });
      });
      test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: validPuzzle,
            value:3,
            coordinate:'A1'
        })
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.deepEqual(res.body.conflict, [ "region" ])
            assert.equal(res.body.valid, false)
            done();
        });
      });
      test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
         chai.request(server)
          .post('/api/check')
          .send({
            puzzle: validPuzzle,
            value:1,
            coordinate:'A1'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false)
            assert.deepEqual(res.body.conflict, [ "row", "column" ])

            done();
          });
      });
      test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
        chai.request(server)
        .post('/api/check')
        .send({
            puzzle: validPuzzle,
            value:5,
            coordinate:'A1'
        })
        .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, false)
            assert.deepEqual(res.body.conflict, [ "row", "column", "region" ])

            done();
        });
      });
      test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
         chai.request(server)
          .post('/api/check')
          .send({
            puzzle: invalidCharInPuzzle,
            value:5,
            coordinate:'A1'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle')
            done();
          });
      })
      test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
         chai.request(server)
         .post('/api/check')
         .send({
           puzzle: tooShort,
           value:5,
           coordinate:'A1'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
           done();
         });
      });
      test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
         chai.request(server)
          .post('/api/check')
          .send({
            puzzle: validPuzzle,
            coordinate:'A10',
            value:5,
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid coordinate')
            done();
          });
      });
      test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
         chai.request(server)
         .post('/api/check')
         .send({
           puzzle: validPuzzle,
           coordinate:'A9',
           value:11,
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.error, 'Invalid value')
           done();
         });
      })
    });
});

after(function() {
  chai.request(server)
  .get('/')
});