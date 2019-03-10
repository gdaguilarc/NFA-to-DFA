const AFD = require('./AFD');
const AFN = require('./AFN');

// AFD TESTS
let automata = new AFD();
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
automata.addState('q3');
automata.addTransition('q0', 'q1', 'a');
automata.addTransition('q0', 'q2', 'a'); //This transition is not added because already exists an a transition

console.log('AFD:\n', automata);
console.log(automata.transitions['q0']);

// AFN Tests
let automata2 = new AFN();
automata2.addState('q0');
automata2.addState('q1');
automata2.addState('q2');
automata2.addState('q3');
automata2.addState('q4');
automata2.addState('q5');
automata2.addState('q6');
automata2.addTransition('q0', 'q1', 'a');
automata2.addTransition('q0', 'q2', 'a'); //This transition is not added because already exists an a transition
automata2.addTransition('q0', 'q3');
automata2.addTransition('q3', 'q1');

// TODO: Test a circular lambda closure
// automata2.addTransition('q4', 'q5');
// automata2.addTransition('q5', 'q6');
// automata2.addTransition('q6', 'q4');

console.log('AFN:\n', automata2);
console.log('Transitions q0:\n', automata2.transitions['q0']);
console.log('Transitions q3:\n', automata2.transitions['q3']);
console.log('Closure q0:\n', automata2.lambdaLock('q0'));
console.log('Closure q1:\n', automata2.lambdaLock('q1'));
