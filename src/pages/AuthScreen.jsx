import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function AuthScreen({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '{}');

      if (isLogin) {
        if (!users[username]) {
          setError('Usuário não encontrado');
        } else if (users[username].password !== btoa(password)) {
          setError('Senha incorreta');
        } else {
          onSuccess(users[username]);
        }
      } else {
        if (username.length < 3) {
          setError('Usuário deve ter pelo menos 3 caracteres');
        } else if (password.length < 6) {
          setError('Senha deve ter pelo menos 6 caracteres');
        } else if (password !== confirmPassword) {
          setError('As senhas não correspondem');
        } else if (users[username]) {
          setError('Este usuário já existe');
        } else {
          const newUser = {
            id: Date.now().toString(),
            username,
            password: btoa(password),
            createdAt: new Date().toISOString(),
          };
          users[username] = newUser;
          localStorage.setItem('users', JSON.stringify(users));
          onSuccess(newUser);
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bem-vindo' : 'Criar Conta'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Faça login em sua conta' : 'Crie uma nova conta'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Processando...' : (
                <>
                  <span>{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm mb-3">
              {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition"
            >
              {isLogin ? 'Criar Conta' : 'Fazer Login'}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            NutriAI © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
