import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateUserForm from './CreateUserForm';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: jest.fn(),
}));

const mockUseParams = require('react-router-dom').useParams;

describe('CreateUserForm (same concept)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockUseParams.mockReturnValue({});
    process.env.REACT_APP_API_URL = 'http://localhost:5000';
  });

  it('renders all fields and submit button', () => {
    render(
      <BrowserRouter>
        <CreateUserForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(/Create|Update/i);
  });

  it('shows error for invalid email', async () => {
    render(
      <BrowserRouter>
        <CreateUserForm />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/Invalid email address/)).toBeInTheDocument();
  });

  it('submits form and shows success for edit', async () => {
    mockUseParams.mockReturnValue({ id: '123' });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.com' })
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    render(
      <BrowserRouter>
        <CreateUserForm />
      </BrowserRouter>
    );
    expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Janet' } });
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/users/123',
        expect.objectContaining({ method: 'PUT' })
      );
    });
    expect(await screen.findByText(/User updated!/)).toBeInTheDocument();
  });

  it('shows error if server returns error on edit', async () => {
    mockUseParams.mockReturnValue({ id: '123' });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ firstName: 'Jane', lastName: 'Smith', email: 'jane@smith.com' })
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Update failed' })
      });
    render(
      <BrowserRouter>
        <CreateUserForm />
      </BrowserRouter>
    );
    expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText(/Update failed/)).toBeInTheDocument();
  });
});
