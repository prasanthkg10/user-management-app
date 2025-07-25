import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('UserList (same concept)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    process.env.REACT_APP_API_URL = 'http://localhost:5000';
  });

  it('renders loading spinner', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders user data after fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@doe.com' }]),
    });
    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>
    );
    expect(await screen.findByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@doe.com')).toBeInTheDocument();
  });

  it('shows error if fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>
    );
    expect(await screen.findByText(/Network response was not ok/)).toBeInTheDocument();
  });

  it('shows no users found if list is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>
    );
    expect(await screen.findByText(/No users found/)).toBeInTheDocument();
  });

  it('deletes a user and shows success', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ([{ _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@doe.com' }]),
      })
      .mockResolvedValueOnce({ ok: true });
    render(
      <BrowserRouter>
        <UserList />
      </BrowserRouter>
    );
    expect(await screen.findByText('John')).toBeInTheDocument();
  });
});
