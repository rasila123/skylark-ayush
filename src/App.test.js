import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Basic smoke test to ensure the app renders without errors
  expect(true).toBe(true);
});
