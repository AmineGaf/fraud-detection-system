import { Lock, Mail } from 'lucide-react';
import {  useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { ForgotPasswordDialog } from '@/components/login/ForgotPasswordDialog';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        username: data.email,
        password: data.password
      });
      navigate(from, { replace: true });
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/20 p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none sm:text-sm"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            {errors.email && (
              <p className="mt-1 ml-2 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <ForgotPasswordDialog />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none sm:text-sm"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />

            </div>
            {errors.password && (
              <p className="mt-1 ml-2 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                {...register('rememberMe')}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};