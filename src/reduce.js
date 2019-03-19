/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * This script is in charge of performing the minimization
 * of the AFD resulting from the transformation of the AFN
 *
 * @author      David Aguilar
 * @author      Andrea Becerra
 * @author      Saul Neri
 * @version     1.0.0
 * @since       1.0.0
 */

// TODO: Reduce method
const AFD = require('./AFD');

const test = require('./transformation.js');

function initializePairs(numberStates) {
  const pairs = [];

  for (let i = 0; i < numberStates; i += 1) {
    for (let j = 1; j < numberStates; j += 1) {
      if (i < j) {
        pairs[`${i},${j}`] = 0;
      }
    }
  }
  return pairs;
}

function checkPairs(pairs, states, final) {
  const newPairs = pairs;
  for (const i in pairs) {
    const indexes = i.split(',');
    const possibleStates = [];
    indexes.forEach(element => {
      possibleStates.push(states[parseInt(element, 10)]);
    });

    if (
      (final.includes(possibleStates[0]) && !final.includes(possibleStates[1])) ||
      (final.includes(possibleStates[1]) && !final.includes(possibleStates[0]))
    ) {
      newPairs[i] = 1;
    }
  }
  return newPairs;
}
// function dist(i, j){

// }

function checkTransition(indexa, indexb, letter, statesD, automata) {
  const stateA = automata.states[indexa];
  const stateB = automata.states[indexb];

  const m = automata.states.indexOf(
    automata.transitions[stateA].filter(elem => elem.letter === letter)[0].final
  );
  const n = automata.states.indexOf(
    automata.transitions[stateB].filter(elem => elem.letter === letter)[0].final
  );

  return statesD[`${m},${n}`] === 1 || statesD[`${n},${m}`] === 1;
}

function reduceAFN(automata) {
  let statesD = initializePairs(automata.states.length);
  let statesS = initializePairs(automata.states.length);
  // TODO: checkpairs od D  --> for -> if  --> dist / else

  statesD = checkPairs(statesD, automata.states, automata.final);

  automata.alphabet.forEach(letter => {
    for (const i in statesD) {
      if (statesD[i] === 0) {
        const indexa = i.split(',')[0];
        const indexb = i.split(',')[1];

        if (
          checkTransition(parseInt(indexa, 10), parseInt(indexb, 10), letter, statesD, automata)
        ) {
          // DIST
          console.log('DIST');
        }
      }
    }
  });
}

const automata = new AFD();
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
automata.addState('q3');
automata.addState('q4');
automata.addState('q5');
automata.addState('q6');
automata.addState('q7');

automata.addInitial('q0');

automata.addFinal('q1');
automata.addFinal('q2');
automata.addFinal('q3');
automata.addFinal('q4');
automata.addFinal('q5');
automata.addFinal('q6');

automata.addLetter('a');
automata.addLetter('b');

automata.addTransition('q0', 'q1', 'a');
automata.addTransition('q0', 'q4', 'b');

automata.addTransition('q1', 'q2', 'a');
automata.addTransition('q1', 'q3', 'b');

automata.addTransition('q2', 'q7', 'a');
automata.addTransition('q2', 'q7', 'b');

automata.addTransition('q3', 'q7', 'a');
automata.addTransition('q3', 'q3', 'b');

automata.addTransition('q4', 'q5', 'a');
automata.addTransition('q4', 'q6', 'b');

automata.addTransition('q5', 'q7', 'a');
automata.addTransition('q5', 'q7', 'b');

automata.addTransition('q6', 'q7', 'a');
automata.addTransition('q6', 'q6', 'b');

automata.addTransition('q7', 'q7', 'a');
automata.addTransition('q7', 'q7', 'b');

console.log(automata);
reduceAFN(automata);

module.exports = reduceAFN;
