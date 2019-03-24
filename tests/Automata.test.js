const Automata = require('../src/Automata');

test('Create a Finite Automata', () => {
  expect(JSON.stringify(new Automata())).toBe(
    '{"states":[],"alphabet":[],"initial":null,"final":[],"transitions":[]}'
  );
});

test('Adds a state to the automata', () => {
  const automata = new Automata();
  automata.addState('q0');
  expect(automata.states.includes('q0')).toBe(true);
});

test('Add initial state', () => {
  const automata = new Automata();
  automata.addState('q0');
  automata.addInitial('q0');
  automata.addInitial('q1');
  expect(automata.initial).toBe('q0');
});

test('Remove final', () => {
  const automata = new Automata();
  automata.addState('q0');
  automata.addState('q1');
  automata.addFinal('q0');
  automata.addFinal('q1');
  automata.removeFinal('q1');
  expect(automata.final).toEqual(['q0']);
});

test('Remove transitions', () => {
  const automata = new Automata();
  automata.addState('q0');
  automata.addState('q1');
  automata.addState('q2');
  automata.addState('q3');
  const transitions = [];
  transitions.q0 = { letter: 'a', final: 'q2' };
  transitions.q1 = { letter: 'a', final: 'q3' };
  automata.transitions = transitions;
  automata.removeTransitions('q0');
  expect(Object.keys(automata.transitions)).toHaveLength(1);
});

test('Remove state', () => {
  const automata = new Automata();
  automata.addState('q1');
  automata.removeState('q1');
  expect(automata.states.includes('q1')).toBe(false);
});

test('Remove initial', () => {
  const automata = new Automata();
  automata.addState('q0');
  automata.addInitial('q0');
  automata.removeState('q0');
  expect(automata.states.includes('q0')).toBe(true);
});

test('Delete Transition', () => {
  const automata = new Automata();
  automata.addState('q0');
  automata.addState('q2');
  automata.addState('q3');
  const transitions = [];
  transitions.q0 = [{ letter: 'a', final: 'q2' }, { letter: 'a', final: 'q3' }];
  automata.transitions = transitions;
  automata.deleteTransition('q0', 'a', 'q2');
  expect(Object.keys(automata.transitions.q0)).toHaveLength(1);
});
