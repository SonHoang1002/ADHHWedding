import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the invitation picker with three designs', () => {
  render(<App />);
  expect(screen.getByText(/Trân trọng kính mời/i)).toBeInTheDocument();
  expect(screen.getByText('Phong bì cổ điển')).toBeInTheDocument();
  expect(screen.getByText('Tối giản hiện đại')).toBeInTheDocument();
  expect(screen.getByText('Thiệp hoa')).toBeInTheDocument();
});
