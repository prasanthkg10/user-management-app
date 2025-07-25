import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateUserForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            // Fetch user data for editing
            const fetchUser = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch user');
                    const user = await response.json();
                    setFirstName(user.firstName);
                    setLastName(user.lastName);
                    setEmail(user.email);
                } catch (err: any) {
                    setError(err.message);
                }
            };
            fetchUser();
        }
    }, [id]);

    const validate = () => {
        if (!nameRegex.test(firstName) || firstName.length > 100) {
            return 'First name must be alphabetical and max 100 characters.';
        }
        if (!nameRegex.test(lastName) || lastName.length > 100) {
            return 'Last name must be alphabetical and max 100 characters.';
        }
        if (!emailRegex.test(email)) {
            return 'Invalid email address.';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            let response;
            if (id) {
                // Edit user
                response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email }),
                });
            } else {
                // Create user
                response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email }),
                });
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to submit');
            }
            setSuccess(true);
            setTimeout(() => navigate('/'), 1000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Paper sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Edit User' : 'Create User'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
                    required
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 100 }}
                    required
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{id ? 'User updated!' : 'User created!'}</Alert>}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    {id ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Paper>
    );
};

export default CreateUserForm;