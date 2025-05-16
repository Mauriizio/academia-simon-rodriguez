
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import { User, Mail, Edit3, Save, BookOpen } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Link } from 'react-router-dom';

const UserProfilePage = () => {
  const { currentUser, updateUserProfile, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [completedCoursesData, setCompletedCoursesData] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      
      const fetchCompletedCourses = async () => {
        setCoursesLoading(true);
        if (currentUser.completedCourses) {
          const courseIds = Object.keys(currentUser.completedCourses);
          const coursesPromises = courseIds.map(async (courseId) => {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDoc(courseRef);
            return courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null;
          });
          const courses = (await Promise.all(coursesPromises)).filter(Boolean);
          setCompletedCoursesData(courses);
        }
        setCoursesLoading(false);
      };
      fetchCompletedCourses();
    }
  }, [currentUser]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUserProfile({ displayName });
      toast({ title: "Perfil Actualizado", description: "Tu información ha sido guardada." });
      setIsEditing(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
    setFormLoading(false);
  };

  if (authLoading || !currentUser) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto shadow-2xl glassmorphism">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative w-32 h-32 mx-auto mb-4"
            >
              <Avatar className="w-32 h-32 border-4 border-primary shadow-lg">
                <AvatarImage src={currentUser.photoURL || ''} alt={displayName} />
                <AvatarFallback className="text-4xl bg-primary/20 text-primary font-semibold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-0 right-0 rounded-full bg-background hover:bg-accent"
                onClick={handleEditToggle}
              >
                {isEditing ? <Save className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">{isEditing ? "Editar Perfil" : displayName}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nombre Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico (no editable)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email" type="email" value={email} disabled className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent" disabled={formLoading}>
                  {formLoading ? <LoadingSpinner size="sm" /> : "Guardar Cambios"}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Haz clic en el botón de editar en la imagen para modificar tu nombre.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center gradient-text">Mis Cursos Completados</h2>
          {coursesLoading ? (
            <LoadingSpinner />
          ) : completedCoursesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCoursesData.map(course => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0px 8px 15px rgba(var(--primary-rgb), 0.15)" }}
                >
                  <Card className="h-full overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 border-transparent hover:border-primary/50 glassmorphism">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-primary">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link" className="text-accent p-0">
                        <Link to={`/courses/${course.id}`}>Ver Detalles del Curso</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aún no has completado ningún curso.</p>
              <Button asChild className="mt-4">
                <Link to="/courses">Explorar Cursos</Link>
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
  