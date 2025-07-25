import React, { useEffect, useState } from 'react';
import { User } from '../types/User';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError(String(error));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (id: string) => {
        setDeleting(id);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to Delete user');
            }
            setSuccess(true);
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
            <Typography variant="h4" gutterBottom>User List</Typography>
            {success && <Alert severity="success" sx={{ mt: 2 }}>Deleted Successfully</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => navigate(`/edit/${user._id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        style={{ marginLeft: '8px' }}
                                        onClick={() => deleteUser(user._id)}
                                        disabled={deleting === user._id}
                                    >
                                        {deleting === user._id ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body1" color="textSecondary">No users found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UserList;