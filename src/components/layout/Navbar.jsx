
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, LogIn, UserPlus, User, LogOut, ShieldCheck, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const { currentUser, isAdmin, signOut: authSignOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await authSignOut();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message,
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="bg-background/80 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">EduPlatform</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/courses">Cursos</Link>
          </Button>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'Usuario'} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {getInitials(currentUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.displayName || 'Usuario'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Panel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link to="/admin/upload-course" className="flex items-center">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        <span>Subir Curso</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                <Link to="/register" className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" /> Registrarse
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
  