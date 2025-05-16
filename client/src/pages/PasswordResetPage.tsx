import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<{ newPassword: string }>();

  const onSubmit = async (data: { newPassword: string }) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: data.newPassword
        })
      });

      if (!response.ok) throw new Error('Password reset failed');

      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 p-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <Input
          type="password"
          placeholder="New password"
          {...register('newPassword', { required: true })}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}