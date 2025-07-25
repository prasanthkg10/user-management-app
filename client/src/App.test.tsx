import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock internal route components
jest.mock('./components/UserList', () => () => <div>User List Page</div>);
jest.mock('./components/CreateUserForm', () => () => <div>Create User Page</div>);

describe('App component', () => {
  test('renders UserList by default ("/")', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText('User List Page')).toBeInTheDocument();
  });

  test('navigates to CreateUserForm at "/create"', () => {
    window.history.pushState({}, '', '/create');
    render(<App />);
    expect(screen.getByText('Create User Page')).toBeInTheDocument();
  });

  test('navigates to CreateUserForm for edit route "/edit/:id"', () => {
    window.history.pushState({}, '', '/edit/123');
    render(<App />);
    expect(screen.getByText('Create User Page')).toBeInTheDocument();
  });
});