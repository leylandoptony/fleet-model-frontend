// src/Login.js
import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import useAdminAuth from '../store/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useNavigate,useLocation } from 'react-router-dom';


const hashedPassword = '$2a$10$lzDn/ZSViOsM2BXjYqIWSu3mpWqWvvYqyyW4x0yB4m2/C4cwrgDXK'; // Replace this with your hashed password

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';


  const handleSubmit = (e) => {
    e.preventDefault();
    if (bcrypt.compareSync(password, hashedPassword)) {
      login();
      navigate(from, { replace: true });
    } else {
      setMessage('Incorrect password');
    }
  };

  return (
    <div className="w-full h-full border flex justify-center items-center">
      
      <Card className="h-[300px] w-[400px] p-4">
        <CardHeader className="pb-5">
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter the admin password to access</CardDescription>
          <p className="text-sm text-red-400">{message}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Button type="submit">Login</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
