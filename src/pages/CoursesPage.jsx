
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, checkFirebaseConfig } from '@/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CourseCard = ({ course }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(var(--primary-rgb), 0.2)" }}
    className="h-full"
  >
    <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 border-transparent hover:border-primary/50 glassmorphism">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <img  
            src={course.thumbnailUrl || `https://source.unsplash.com/random/400x225?course,education,${course.id}`} 
            alt={course.title} 
            className="w-full h-full object-cover"
           src="https://images.unsplash.com/photo-1677696795233-5ef097695f12" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <CardTitle className="text-xl font-bold text-white">{course.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardDescription className="text-muted-foreground mb-4 line-clamp-3">{course.description}</CardDescription>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-2 text-primary" />
          <span>{course.lessonsCount || 'Varias'} lecciones</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300 group">
          <Link to={`/courses/${course.id}`}>
            Ver Curso <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);


const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!checkFirebaseConfig()) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Configuración Incompleta",
          description: "Firebase no está configurado. No se pueden cargar los cursos.",
        });
        return;
      }
      try {
        const coursesCollection = collection(db, 'courses');
        const q = query(coursesCollection, orderBy('createdAt', 'desc'));
        const courseSnapshot = await getDocs(q);
        const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        toast({
          variant: "destructive",
          title: "Error al Cargar Cursos",
          description: "No se pudieron cargar los cursos. Inténtalo de nuevo más tarde.",
        });
      }
      setLoading(false);
    };

    fetchCourses();
  }, [toast]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          <span className="gradient-text">Explora Nuestros Cursos</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Encuentra el curso perfecto para ti y comienza tu viaje de aprendizaje hoy mismo.
        </p>
        <div className="mb-8 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar cursos por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-border focus:border-primary transition-colors duration-300"
          />
        </div>
      </motion.div>

      {filteredCourses.length === 0 && !loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">
            {searchTerm ? "No se encontraron cursos que coincidan con tu búsqueda." : "Aún no hay cursos disponibles. ¡Vuelve pronto!"}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
  