
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        className="max-w-md"
      >
        <AlertTriangle className="h-32 w-32 text-destructive mx-auto mb-8" />
        <h1 className="text-6xl font-extrabold mb-4 gradient-text">404</h1>
        <h2 className="text-3xl font-semibold mb-6 text-foreground">¡Ups! Página no encontrada.</h2>
        <p className="text-lg text-muted-foreground mb-10">
          Parece que te has perdido. La página que buscas no existe o ha sido movida.
        </p>
        <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 group">
          <Link to="/">
            <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Volver a la Página Principal
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
  