
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookCheck, Users, Video } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <BookCheck className="h-10 w-10 text-primary" />,
      title: "Cursos de Calidad",
      description: "Aprende de expertos con contenido actualizado y relevante.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Comunidad Activa",
      description: "Conéctate con otros estudiantes y profesionales del sector.",
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: "Aprendizaje Flexible",
      description: "Estudia a tu propio ritmo, en cualquier momento y lugar.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="gradient-text">Transforma Tu Futuro</span> con EduPlatform
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10">
          Descubre una nueva forma de aprender en línea. Cursos diseñados por expertos para impulsar tu carrera profesional y personal.
        </p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        >
          <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 text-lg px-8 py-6 group">
            <Link to="/courses">
              Explorar Cursos <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.5,
            },
          },
          hidden: { opacity: 0 },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 20 },
            }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-xl shadow-2xl glassmorphism hover:shadow-primary/30 transition-shadow duration-300"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h2>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="mt-24 w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-gradient-to-r from-primary/80 to-accent/80 p-8 md:p-12 rounded-xl shadow-xl text-primary-foreground"
        >
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-lg mb-6">Únete a miles de estudiantes que ya están alcanzando sus metas.</p>
          <Button size="lg" variant="secondary" asChild className="text-primary font-semibold hover:bg-white/90 transition-colors">
            <Link to="/register">
              Regístrate Gratis
            </Link>
          </Button>
        </motion.div>
      </div>
      
      <div className="py-12">
        <h2 className="text-3xl font-bold mb-8 gradient-text">Nuestros Colaboradores</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <img  alt="Logo Empresa 1" className="h-10 md:h-12 text-muted-foreground filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a" />
          <img  alt="Logo Empresa 2" className="h-10 md:h-12 text-muted-foreground filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
          <img  alt="Logo Empresa 3" className="h-10 md:h-12 text-muted-foreground filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1485531865381-286666aa80a9" />
          <img  alt="Logo Empresa 4" className="h-10 md:h-12 text-muted-foreground filter grayscale hover:grayscale-0 transition-all duration-300" src="https://images.unsplash.com/photo-1649000808933-1f4aac7cad9a" />
        </div>
      </div>

    </div>
  );
};

export default HomePage;
  