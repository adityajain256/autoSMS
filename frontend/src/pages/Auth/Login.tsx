import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { Card } from '../../components/common/Card';
import { Lock, Phone } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../utils/api.ts';
import { Loader } from '../../components/common/Loader';


export function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  if(isLoading){
    return(
      <Loader />
    )
  }

  const handleLogin = async () => {
    if (formData.phoneNumber.length !== 10) {
      addToast("Phone number must be 10 digits", "error");
      return;
    }
    if (formData.password.length < 8) {
      addToast("Password must be at least 8 characters", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data?.token);
      addToast("Login successful", "success");
      navigate("/dashboard");
        

    } catch (error: any) {
      console.log(error);
      addToast(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 glass-panel p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xl mb-4">
            AS
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Welcome Back</h1>
          <p className="text-on-surface-variant text-sm mt-1">Sign in to manage your SMS campaigns</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+91 00000 00000"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            leftIcon={<Phone className="w-5 h-5" />}
            required
          />
          <p className="text-red-600 text-sm mt-1">{(formData.phoneNumber.length !== 10) ? "Phone number must be 10 digits" : ""}</p>
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            leftIcon={<Lock className="w-5 h-5" />}
            required
          />
          <p className="text-red-600 text-sm mt-1">{(formData.password.length < 8) ? "Password must be at least 8 characters" : ""}</p>

          <div className="flex items-center justify-between text-sm mt-1 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
              <span className="text-on-surface-variant font-medium">Remember me</span>
            </label>
            <a href="#" className="font-semibold text-primary hover:text-primary-container">
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} onClick={handleLogin} className="w-full">
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-sm">
            Don't have an account? <Link to="/signup" className="font-semibold text-primary hover:text-primary-container">Sign Up</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
