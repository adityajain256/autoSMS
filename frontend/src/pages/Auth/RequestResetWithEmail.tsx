import { useState } from 'react';
import { Button } from '../../components/common/Button.tsx';
import { InputField } from '../../components/common/InputField.tsx';
import { Card } from '../../components/common/Card.tsx';
import {  Mail } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.tsx';
import { api } from '../../utils/api.ts';
import { Loader } from '../../components/common/Loader.tsx';
import logo from '../../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

export function RequestResetWithEmail() {

  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const location = useLocation();
  const agenda = location.state?.agenda as "reset" | "verify" | undefined;

  if(isLoading){
    return(
      <Loader />
    )
  }

  const sendRequestResetPassword = async () => {
    if (formData.email.length === 0) {
      addToast("Email is required to reset password", "error");
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post("/auth/request-reset-password", { email: formData.email });
      addToast(response.data?.message || "Reset link sent to your email", "success");
    } catch (err: unknown) {
      addToast((err as Error).message || "Failed to send reset link", "error");
    } finally {
      setIsLoading(false);
    }
  }

  const verifyEmail = async () => {
    if (formData.email.length === 0) {
      addToast("Email is required to verify email", "error");
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post("/auth/verify-email", { email: formData.email });
      navigate('/otp-verification', { state: { email: formData.email } });
      addToast(response.data?.message || "Verification email sent", "success");
    } catch (err: unknown) {
      addToast((err as Error).message || "Failed to send verification email", "error");
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
          <h1 className="text-2xl font-bold text-on-surface">{agenda === "reset" ? "Reset Password" : "Verify Email"}</h1>
          <p className="text-on-surface-variant text-sm mt-1">Enter your email to receive a {agenda === "reset" ? "password reset link" : "verification email"} </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            (agenda === "reset" ? sendRequestResetPassword : verifyEmail)();
          }}
          className="flex flex-col gap-5"
        >
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            leftIcon={<Mail className="w-5 h-5" />}
            required
          />
          <p className="text-red-600 text-sm mt-1">{(formData.email.length < 1) ? "Enter your email" : ""}</p>
          
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
