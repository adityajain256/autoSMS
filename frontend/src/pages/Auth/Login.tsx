import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Card } from '../../components/common/Card';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      addToast('Successfully signed in!', 'success');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass-panel p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xl mb-4">
            CA
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Welcome Back</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sign in to manage your SMS campaigns</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <InputField
            label="Email Address"
            type="email"
            placeholder="admin@ca-firm.com"
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-5 h-5" />}
            required
          />

          <div className="flex items-center justify-between text-sm mt-1 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
              <span className="text-on-surface-variant font-medium">Remember me</span>
            </label>
            <a href="#" className="font-semibold text-primary hover:text-primary-container">
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
}
