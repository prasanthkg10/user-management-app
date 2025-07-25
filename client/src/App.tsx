import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './components/UserList';
import CreateUserForm from './components/CreateUserForm';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

const App: React.FC = () => (
  <Router>
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">User List</Button>
        <Button color="inherit" component={Link} to="/create">Create User</Button>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 4 }}>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create" element={<CreateUserForm />} />
        <Route path="/edit/:id" element={<CreateUserForm />} />
      </Routes>
    </Container>
  </Router>
);

export default App;