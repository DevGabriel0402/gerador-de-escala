import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '../styles/components';
import logoPratique from '../assets/logo.png'; // or Menor-PRATIQUE.png
import { LogoLoader } from '../components/LogoLoader';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseLogo = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  padding: 1rem;
`;

const BackgroundElement = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(229,9,20,0.15) 0%, rgba(229,9,20,0) 70%);
  z-index: 0;
  
  &.circle1 {
    width: 600px;
    height: 600px;
    top: -200px;
    left: -200px;
    animation: ${float} 8s ease-in-out infinite;
  }
  &.circle2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    right: -100px;
    animation: ${float} 6s ease-in-out infinite reverse;
  }
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  z-index: 1;
  animation: ${slideUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${pulseLogo} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  
  img {
    height: 65px;
    object-fit: contain;
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
  }
  
  h1 {
    color: white;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0;
  }
  
  p {
    color: #888;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    letter-spacing: 0.5px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  
  label {
    display: block;
    color: #aaa;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg.icon {
    position: absolute;
    left: 14px;
    color: #666;
    width: 20px;
    height: 20px;
    transition: color 0.3s;
  }

  input {
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1rem 1rem 1rem 2.8rem;
    color: white;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: #555;
    }

    &:focus {
      border-color: #e50914;
      background: rgba(0, 0, 0, 0.4);
      box-shadow: 0 0 0 4px rgba(229, 9, 20, 0.1);
    }
    
    &:focus + svg.icon {
      color: #e50914;
    }
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 14px;
  background: transparent;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
`;

const ForgotPassword = styled.button`
  background: transparent;
  border: none;
  color: #e50914;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
  transition: filter 0.2s;
  
  &:hover {
    filter: brightness(1.2);
    text-decoration: underline;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 1.1rem;
  font-size: 1.1rem;
  margin-top: 1rem;
  background: linear-gradient(90deg, #e50914 0%, #b80710 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(229, 9, 20, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(229, 9, 20, 0.4);
  }
`;

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos!');
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // App.jsx will automatically detect auth state change
      toast.success('Bem-vindo!');
    } catch (error) {
      console.error(error);
      toast.error('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Digite seu e-mail acima para redefinir a senha.');
      return;
    }
    
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar e-mail. Verifique se o endereço está correto.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Container>
      <BackgroundElement className="circle1" />
      <BackgroundElement className="circle2" />
      
      <LoginBox>
        <LogoContainer>
          <img src={logoPratique} alt="Pratique Logo" />
          <h1>Portal da Equipe</h1>
          <p>Faça login para acessar suas escalas</p>
        </LogoContainer>
        
        <form onSubmit={handleLogin}>
          <InputGroup>
            <label>E-mail</label>
            <InputWrapper>
              <Mail className="icon" />
              <input 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </InputGroup>
          
          <InputGroup>
            <label>Senha</label>
            <InputWrapper>
              <Lock className="icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TogglePassword 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </TogglePassword>
            </InputWrapper>
            <ForgotPassword type="button" onClick={handleResetPassword} disabled={isResetting}>
              {isResetting ? 'Enviando...' : 'Esqueceu a senha?'}
            </ForgotPassword>
          </InputGroup>
          
          <StyledButton type="submit" $variant="primary" disabled={isLoading}>
            {isLoading ? <LogoLoader size="28px" /> : 'Entrar na Conta'}
          </StyledButton>
        </form>
      </LoginBox>
    </Container>
  );
}
