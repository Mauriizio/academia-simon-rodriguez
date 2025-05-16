
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, checkFirebaseConfig } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2, Users, BookOpen, BarChart3 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`p-6 rounded-xl shadow-lg ${color} text-white glassmorphism border-transparent hover:border-white/30`}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

const AdminDashboardPage = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!checkFirebaseConfig()) {
      setLoading(false);
      toast({ variant: "destructive", title: "Configuración Incompleta", description: "Firebase no está configurado." });
      return;
    }
    setLoading(true);
    try {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);

      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);

    } catch (error) {
      console.error("Error fetching data: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos." });
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [toast]);

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      setCourses(courses.filter(course => course.id !== courseId));
      toast({ title: "Curso Eliminado", description: "El curso ha sido eliminado exitosamente." });
    } catch (error) {
      console.error("Error deleting course: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el curso." });
    }
  };

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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold gradient-text mb-4 sm:mb-0">Panel de Administración</h1>
          <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
            <Link to="/admin/upload-course">
              <PlusCircle className="mr-2 h-5 w-5" /> Subir Nuevo Curso
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Cursos Totales" value={courses.length} icon={<BookOpen className="h-8 w-8 opacity-70" />} color="bg-primary" />
          <StatCard title="Usuarios Registrados" value={users.length} icon={<Users className="h-8 w-8 opacity-70" />} color="bg-accent" />
          <StatCard title="Placeholder Stat" value="123" icon={<BarChart3 className="h-8 w-8 opacity-70" />} color="bg-purple-600" />
        </div>

        <h2 className="text-2xl font-bold mb-6">Gestionar Cursos</h2>
        {courses.length === 0 ? (
          <p className="text-muted-foreground">No hay cursos para mostrar. ¡Crea el primero!</p>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 glassmorphism">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Lecciones: {course.lessons ? course.lessons.length : 0}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/edit-course/${course.id}`}> {/* Placeholder, edit page not created yet */}
                        <Edit className="mr-1 h-4 w-4" /> Editar
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el curso <span className="font-semibold">{course.title}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                            Sí, eliminar curso
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
  