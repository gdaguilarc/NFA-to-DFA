const express = require('express');

const router = express.Router();

const AFD = require('../src/AFD');

const AFN = require('../src/AFN');

const Transformation = require('../src/transformation');

const Reduction = require('../src/reduce');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/upload', (req, res) => {
  let a = new AFN();
  a.addLetter('c');
  a.addLetter('b');
  a.addLetter('a');
  a.addState('q0');
  a.addState('q1');
  a.addState('q2');
  a.addInitial('q0');
  a.addFinal('q1');
  a.addTransition('q0', 'q0', 'a');
  a.addTransition('q0', 'q1', 'a');
  a.addTransition('q0', 'q2', 'a');
  a.addTransition('q1', 'q1', 'b');
  a.addTransition('q2', 'q2', 'c');
  a.addTransition('q2', 'q1');

  // ------------------------------------------------------
  let b = new AFD();
  b.addState('q0');
  b.addState('q1');
  b.addState('q2');
  b.addState('q3');
  b.addState('q4');
  b.addState('q5');
  b.addState('q6');

  b.addInitial('q0');

  b.addFinal('q4');
  b.addFinal('q5');
  b.addFinal('q6');

  b.addLetter('a');
  b.addLetter('b');
  b.addTransition('q0', 'q1', 'b');
  b.addTransition('q0', 'q4', 'a');

  b.addTransition('q1', 'q2', 'b');
  b.addTransition('q1', 'q5', 'a');

  b.addTransition('q2', 'q3', 'b');
  b.addTransition('q2', 'q6', 'a');
  b.addTransition('q3', 'q3', 'a');
  b.addTransition('q3', 'q3', 'b');
  b.addTransition('q4', 'q4', 'a');
  b.addTransition('q4', 'q4', 'b');
  b.addTransition('q5', 'q5', 'a');
  b.addTransition('q5', 'q5', 'b');
  b.addTransition('q6', 'q6', 'a');
  b.addTransition('q6', 'q6', 'b');

  a = Transformation(a);
  b = Reduction(b);
  res.render('test', {
    transform: {
      states: a.states,
      alphabet: a.alphabet,
      initial: a.initial,
      final: a.final,
      transitions: a.listTransitions()
    }
  });
});

module.exports = router;
