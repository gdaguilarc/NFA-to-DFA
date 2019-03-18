/**
 * This script is in charge of performing the transformation from a Lambda AFN to a AFD
 *
 * @author      David Aguilar
 * @author      Andrea Becerra
 * @author      Saul Neri
 * @version     1.0.0
 * @since       1.0.0
 */

const AFD = require('./AFD');
const AFN = require('./AFN');

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

function getTransitions(array, letter, automata) {
  const letterArray = [];
  const result = [];
  array.forEach(state => {
    letterArray.push(
      automata.transitions[state].filter(elem => {
        return elem.letter === letter;
      })
    );
  });

  letterArray.forEach(elem => {
    elem.forEach(tr => {
      result.push(tr.final);
    });
  });

  return result.join(',');
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
  result.addState(tableClosures[automata.initial]);
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
      let temp = [];
      const transitionsT = getTransitions(tableClosures[st].closure, letter, automata);

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

      if (!tableT[st]) {
        tableT[st] = [];
      }

      tableT[st].push(temp);
    });
  });

  return tableT;
}

const a = new AFN();
a.addLetter('a');
a.addLetter('b');
a.addLetter('c');
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

console.log('Tabla T \n', Transformation(a));
console.log('Tabla T \n', Transformation(b));
console.log('Tabla T \n', Transformation(c));

module.exports = Transformation;
