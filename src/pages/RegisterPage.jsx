
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import { checkFirebaseConfig, FIREBASE_CONFIG_PLACEHOLDER } from '@/firebase';

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkFirebaseConfig()) {
      toast({
        variant: "destructive",
        title: "Configuración Incompleta",
        description: "Por favor, configura Firebase antes de continuar.",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error de Contraseña",
        description: "Las contraseñas no coinciden.",
      });
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, displayName);
      toast({
        title: "Registro Exitoso",
        description: "Tu cuenta ha sido creada. ¡Bienvenido!",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al Registrarse",
        description: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl glassmorphism">
          <CardHeader className="text-center">
             <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              className="mx-auto bg-primary/20 p-3 rounded-full inline-block mb-4"
            >
              <UserPlus className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">Crear Cuenta</CardTitle>
            <CardDescription>Únete a nuestra comunidad de aprendizaje.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="displayName">Nombre Completo</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Tu Nombre"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Button variant="link" asChild className="p-0 text-primary hover:underline">
                <Link to="/login">Inicia sesión aquí</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
  