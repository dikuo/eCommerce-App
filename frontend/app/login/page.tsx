'use client';

import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ShopContext } from "@/context/ShopContext";
import axios from "axios";
import { toast } from "sonner"; // Switched to Sonner for that cleaner premium look
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome to the community!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Welcome back");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  if (!isMounted) return null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 animate-in fade-in duration-700">
      <div className="w-full max-w-[400px] space-y-8">
        
        {/* --- Header Section --- */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-medium tracking-tighter text-zinc-900 uppercase">
            {currentState}
          </h2>
          <div className="h-[1px] w-12 bg-black mx-auto" />
          <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] pt-2 uppercase">
            {currentState === 'Login' ? 'Enter your credentials' : 'Create your account'}
          </p>
        </div>

        {/* --- Form Section --- */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          
          {currentState === "Sign Up" && (
            <div className="relative group">
              <Input
                required
                type="text"
                placeholder="Full Name"
                className="pl-10 h-12 rounded-xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User className="absolute left-3.5 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
            </div>
          )}

          <div className="relative group">
            <Input
              required
              type="email"
              placeholder="Email address"
              className="pl-10 h-12 rounded-xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute left-3.5 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
          </div>

          <div className="relative group">
            <Input
              required
              type="password"
              placeholder="Password"
              className="pl-10 h-12 rounded-xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all duration-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock className="absolute left-3.5 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
          </div>

          {/* --- Bottom Links --- */}
          <div className="flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
            <p className="cursor-pointer hover:text-black transition-colors">Forgot Password?</p>
            {currentState === "Login" ? (
              <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer hover:text-black transition-colors">
                Create Account
              </p>
            ) : (
              <p onClick={() => setCurrentState("Login")} className="cursor-pointer hover:text-black transition-colors">
                Login Here
              </p>
            )}
          </div>

          {/* --- Submit Button --- */}
          <Button 
            disabled={loading}
            className="w-full h-12 rounded-full bg-black text-white hover:bg-zinc-800 transition-all font-bold text-[10px] tracking-[0.3em] group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {currentState === "Login" ? "SIGN IN" : "SIGN UP"}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;