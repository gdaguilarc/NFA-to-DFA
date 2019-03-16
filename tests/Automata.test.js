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
