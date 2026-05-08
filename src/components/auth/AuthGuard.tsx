"use client";

import { useAuth } from "@/lib/AuthContext";
import LoginPage from "@/components/auth/LoginPage";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-void gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-ion-blue to-plasma flex items-center justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <motion.p
          className="text-muted text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Initializing dashboard...
        </motion.p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
