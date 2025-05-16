
import React from 'react';
import { BookOpen, Linkedin, Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/hostinger", name: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com/company/hostinger", name: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com/hostinger", name: "Twitter" },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-background/70 backdrop-blur-sm border-t border-border/50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold gradient-text">EduPlatform</span>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} EduPlatform. Todos los derechos reservados.</p>
            <p>Creado con <span className="text-primary">&hearts;</span> por Hostinger Horizons.</p>
          </div>

          <div className="flex justify-center md:justify-end space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
  