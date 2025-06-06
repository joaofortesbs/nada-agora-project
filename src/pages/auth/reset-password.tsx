import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#0D00F5] flex items-center justify-center text-white font-bold text-xl">
            P
          </div>
          <h1 className="text-2xl font-bold text-[#29335C] dark:text-white">
            Redefinir senha
          </h1>
          <p className="text-sm text-[#64748B] dark:text-white/60">
            Crie uma nova senha para sua conta
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <Button className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
            Redefinir senha
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-[#64748B] dark:text-white/60">
            Lembrou sua senha?{" "}
          </span>
          <Link to="/login" className="text-[#0D00F5] hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
