
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-24 w-24',
  };

  return (
    <div className="flex justify-center items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
  