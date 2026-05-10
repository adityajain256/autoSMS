import { useState } from 'react';
import { Button } from '../../components/common/Button.tsx';
import { InputField } from '../../components/common/InputField.tsx';
import { Card } from '../../components/common/Card.tsx';
import {  Eye, EyeClosed, Mail } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.tsx';
import { api } from '../../utils/api.ts';
import { Loader } from '../../components/common/Loader.tsx';
import logo from '../../assets/logo.png';

export function ResetPassword() {

  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  if(isLoading){
    return(
      <Loader />
    )
  }
  const updatePassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (formData.confirmPassword.length === 0) {
      addToast("Confirm Password is required", "error");
      return;
    }
    try {
      const query = new URLSearchParams(window.location.search);
      const userId = query.get('id');
      const token = query.get('token');
      setIsLoading(true);
      const response = await api.post(
        "/auth/reset-pass",
        { password: formData.confirmPassword },
        { params: { userId, token } }
      );
      addToast(response.data?.message || "Password updated successfully", "success");
    } catch (err: unknown) {
      addToast((err as Error).message || "Failed to update password", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">

      <Card className="w-full max-w-md relative glass-panel p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded  text-on-primary flex items-center justify-center font-bold text-xl mb-4">
            <img src={logo} alt="LIGHTLEAF Logo" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Reset Password</h1>
          <p className="text-on-surface-variant text-sm mt-1">Enter your new password</p>
        </div>

        <form onSubmit={updatePassword} className="flex flex-col gap-5">
          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            rightIcon={showPassword ? <EyeClosed onClick={() => setShowPassword(false)} className="w-5 h-5 cursor-pointer" /> : <Eye onClick={() => setShowPassword(true)} className="w-5 h-5 cursor-pointer" />}
            required
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />
          <p className="text-red-600 text-sm mt-1">{(formData.confirmPassword != formData.password) ? "Passwords do not match" : ""}</p>
          
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} onClick={updatePassword} className="w-full">
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
