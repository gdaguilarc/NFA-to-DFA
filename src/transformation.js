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
      tableClosures[state] = temp;
    }
  });

  return tableClosures;
}

function Transformation(automata) {
  /**
   * INITIALIZATION OF THE DETERMINISTIC AUTOMATA
   */

  // Creation of the Deterministic Automata
  const result = new AFD();

  // Add initial
  result.addState(automata.lambdaLock(automata.initial).join(','));
  result.addInitial(result.states[0]);

  // Adds alphabet
  automata.alphabet.forEach(element => {
    if (element !== 'lambda') {
      result.addLetter(element);
    }
  });

  /**
   * TABLE OF LAMBDA LOCKS aka CLOSURES
   */

  // Table of Lambda locks
  const tableClosures = tableOfClosures(automata);

  /**
   * TABLE OF LAMBDA LOCKS aka CLOSURES
   */

  let newState = '';
  // Creation of the new State
  automata.states.forEach(st => {
    automata.alphabet.forEach(letter => {
      // Closure of the current state
      const firstClosure = tableClosures[st].closure;

      // Store the transitions of the letter
      const closureAfterTransitions = [];

      if (Array.isArray(firstClosure)) {
        let nextClosure = automata.lambdaLock(firstClosure);
        nextClosure.forEach();
      } else {
        firstClosure.forEach(state => {
          console.log('state', state);
          const tempArr = automata.transitions[state].filter(elem => {
            return elem.letter === letter;
          });

          closureAfterTransitions.push(tempArr);
        });
      }
    });
  });

  return closureAfterTransitions;
}

let a = new AFN();
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
a.addTransition('q1', 'q1', 'b');
a.addTransition('q2', 'q2', 'c');
a.addTransition('q2', 'q1');

console.log(tableOfClosures(a));
console.log(Transformation(a));

module.exports = Transformation;
