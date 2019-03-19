/**
 * This script is in charge of performing the transformation from a Lambda AFN to a AFD
 *
 * @author      David Aguilar
 * @author      Andrea Becerra
 * @author      Saul Neri
 * @version     1.0.0
 * @since       1.0.0
 */

// TODO: Update all the comments
// TODO: Testing for this class (jest)
// TODO: Simplificate the code

const AFD = require('./AFD');
const AFN = require('./AFN');

function getTransitions(array, letter, automata) {
  const letterArray = [];
  const result = [];
  array.forEach(state => {
    if (automata.transitions[state]) {
      letterArray.push(
        automata.transitions[state].filter(elem => {
          return elem.letter === letter;
        })
      );
    }
  });

  letterArray.forEach(elem => {
    elem.forEach(tr => {
      result.push(tr.final);
    });
  });

  return result.join(',');
}

function tableOfClosures(automata) {
  const tableClosures = [];
  automata.states.forEach(state => {
    const closure = automata.lambdaLock(state);

    tableClosures[state] = [];

    if (Array.isArray(closure)) {
      tableClosures[state] = { closure };
    } else {
      const temp = [];
      temp.push(closure);
      tableClosures[state] = { closure: temp };
    }
  });

  return tableClosures;
}

function tableTCreation(closure, letter, automata, tableClosures) {
  let temp = [];
  const transitionsT = getTransitions(closure, letter, automata);

  if (transitionsT !== '') {
    // Get the lambda lock of the new transitions
    transitionsT.split(',').forEach(elem => {
      temp = temp.concat(tableClosures[elem].closure);
    });

    // Only the unique
    temp = temp.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    // Sort
    temp.sort((a, b) => {
      return a > b;
    });
  } else {
    temp = ['0'];
  }

  return temp;
}

function Transformation(automata) {
  /**
   * TABLE OF LAMBDA LOCKS aka CLOSURES
   */

  // Table of Lambda locks
  const tableClosures = tableOfClosures(automata);
  /**
   * INITIALIZATION OF THE DETERMINISTIC AUTOMATA
   */

  // Creation of the Deterministic Automata
  const result = new AFD();

  // Add initial
  // TODO: Needs to be an array
  result.addState(tableClosures[automata.initial].closure.join(','));
  result.addInitial(result.states[0]);

  // Adds alphabet
  automata.alphabet.forEach(element => {
    if (element !== 'lambda') {
      result.addLetter(element);
    }
  });

  /**
   * TABLE OF T
   */

  const tableT = [];
  // Creation of the new State
  automata.states.forEach(st => {
    automata.alphabet.forEach(letter => {
      // Closure of the current state

      if (!tableT[st]) {
        tableT[st] = [];
      }
      tableT[st].push(tableTCreation(tableClosures[st].closure, letter, automata, tableClosures));
    });
  });

  // TODO: This needs to be a separate function
  // TODO: return states with no repeted state (q1,q2,q1) = > (q1,q2)   where is my fucking sort?????
  for (let i = 0; i < result.states.length; i += 1) {
    result.alphabet.forEach(letter => {
      const letterIndex = result.alphabet.indexOf(letter);
      let y = [];
      result.states[i].split(',').forEach(elem => {
        // TODO: Change error state from ' ' to 'error'
        if (tableT[elem] && tableT[elem][letterIndex].join(',') !== '0') {
          y.push(tableT[elem][letterIndex].join(','));
        }
      });

      y = y.join(',').split(',');

      y = y.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

      y = y.sort((a, b) => a > b).join(',');

      if (result.states.includes(y)) {
        result.addTransition(result.states[i], y, letter);
      } else {
        result.addState(y);
        result.addTransition(result.states[i], y, letter);
      }
    });
  }

  return result;
}

// TODO: Delete Class testing

const a = new AFN();
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

/* / segunda prueba/ */
const b = new AFN();
b.addLetter('a');
b.addLetter('b');
b.addState('q0');
b.addState('q1');
b.addState('q2');
b.addInitial('q0');
b.addFinal('q2');
b.addTransition('q0', 'q1', 'a');
b.addTransition('q0', 'q2', 'b');
b.addTransition('q1', 'q1', 'a');
b.addTransition('q1', 'q0', 'b');
b.addTransition('q1', 'q0', 'a');
b.addTransition('q2', 'q2', 'b');
b.addTransition('q2', 'q1', 'b');

/* / tercera prueba / */
// TODO :  line 39 error with the filter
const c = new AFN();
c.addLetter('a');
c.addLetter('b');
c.addState('q0');
c.addState('q1');
c.addState('q2');
c.addInitial('q0');
c.addFinal('q2');
c.addTransition('q0', 'q0', 'a');
c.addTransition('q0', 'q1', 'a');
c.addTransition('q1', 'q1', 'b');
c.addTransition('q1', 'q2', 'b');

/* / prueba 4/ */
const d = new AFN();
d.addLetter('a');
d.addLetter('b');
d.addState('q0');
d.addState('q1');
d.addState('q2');
d.addInitial('q0');
d.addFinal('q2, q0');
d.addTransition('q0', 'q0', 'b');
d.addTransition('q0', 'q1', 'a');
d.addTransition('q1', 'q2', 'a');
d.addTransition('q2', 'q2', 'b');
d.addTransition('q2', 'q1', 'b');

/* / prueba 5/ */
const e = new AFN();
e.addLetter('a');
e.addLetter('b');
e.addState('q0');
e.addState('q1');
e.addState('q2');
e.addInitial('q0');
e.addFinal('q2, q0');
e.addTransition('q0', 'q0', 'b');
e.addTransition('q0', 'q1', 'b');
e.addTransition('q0', 'q2', 'a');
e.addTransition('q1', 'q1', 'b');
e.addTransition('q1', 'q2', 'a');
e.addTransition('q2', 'q0', 'b');
e.addTransition('q2', 'q1', 'a');

console.log('RESULT \n', Transformation(e).transitions);

module.exports = Transformation;
