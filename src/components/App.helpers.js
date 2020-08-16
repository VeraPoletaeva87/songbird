import { birds } from './App.constants';

export const getBirdsByStep = (step) => Object.values(birds).filter(({ type }) => type === step);

export const getRandomBirdByStep = (step) => {
  const stepBirds = getBirdsByStep(step);
  const randomBird = Math.round(Math.random() * (stepBirds.length));
  return stepBirds[randomBird];
};

export const getInitialState = () => ({
  currentBird: getRandomBirdByStep(0),
  currentStep: 0,
  clickedBirds: [],
  guessed: false,
  score: 0,
  finished: false
});