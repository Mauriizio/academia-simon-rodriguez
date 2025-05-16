
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth, checkFirebaseConfig } from '@/firebase';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle, PlayCircle, Download, Award, ArrowLeft, FileText, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState([]);
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!checkFirebaseConfig() || !currentUser) {
        setLoading(false);
        return;
      }
      try {
        const courseDocRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseDocRef);

        if (courseSnap.exists()) {
          const courseData = { id: courseSnap.id, ...courseSnap.data() };
          setCourse(courseData);
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const progress = userData.completedCourses?.[courseId]?.completedLessons || [];
            setUserProgress(progress);
          }

        } else {
          toast({ variant: "destructive", title: "Error", description: "Curso no encontrado." });
          navigate('/courses');
        }
      } catch (error) {
        console.error("Error fetching course details: ", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el curso." });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, currentUser, toast, navigate]);

  const toggleLessonComplete = async (lessonId) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const lessonPath = `completedCourses.${courseId}.completedLessons`;
    
    try {
      const isCompleted = userProgress.includes(lessonId);
      if (isCompleted) {
        await updateDoc(userDocRef, { [lessonPath]: arrayRemove(lessonId) });
        setUserProgress(prev => prev.filter(id => id !== lessonId));
        toast({ title: "Progreso Actualizado", description: "Lección marcada como no completada." });
      } else {
        await updateDoc(userDocRef, { [lessonPath]: arrayUnion(lessonId) });
        setUserProgress(prev => [...prev, lessonId]);
        toast({ title: "Progreso Actualizado", description: "¡Lección completada!" });
      }
    } catch (error) {
      console.error("Error updating lesson progress: ", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el progreso." });
    }
  };
  
  const isCourseCompleted = () => {
    if (!course || !course.lessons || course.lessons.length === 0) return false;
    return course.lessons.every(lesson => userProgress.includes(lesson.id));
  };

  const generateCertificate = async () => {
    if (!currentUser || !course) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([11 * 72, 8.5 * 72]); // Letter size, landscape
    const { width, height } = page.getSize();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('CERTIFICADO DE FINALIZACIÓN', {
      x: width / 2 - 200,
      y: height - 100,
      font: helveticaBoldFont,
      size: 30,
      color: rgb(0.1, 0.1, 0.4),
    });

    page.drawText('Este certificado se otorga a', {
      x: width / 2 - 100,
      y: height - 180,
      font: helveticaFont,
      size: 18,
    });

    page.drawText(currentUser.displayName || 'Estudiante Valioso', {
      x: width / 2 - (currentUser.displayName?.length || 10) * 8, // Adjust for name length
      y: height - 230,
      font: helveticaBoldFont,
      size: 28,
      color: rgb(0.6, 0.2, 0.2),
    });

    page.drawText('Por completar exitosamente el curso:', {
      x: width / 2 - 150,
      y: height - 280,
      font: helveticaFont,
      size: 18,
    });

    page.drawText(course.title, {
      x: width / 2 - (course.title.length) * 7, // Adjust for title length
      y: height - 330,
      font: helveticaBoldFont,
      size: 26,
      color: rgb(0.1, 0.4, 0.1),
    });
    
    const date = new Date().toLocaleDateString('es-ES');
    page.drawText(`Fecha: ${date}`, {
      x: 50,
      y: 50,
      font: helveticaFont,
      size: 12,
    });
    
    page.drawText('EduPlatform', {
      x: width - 150,
      y: 50,
      font: helveticaBoldFont,
      size: 16,
      color: rgb(0.5, 0.5, 0.5)
    });


    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificado-${course.title.replace(/\s+/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({ title: "Certificado Generado", description: "Tu certificado se está descargando." });
  };


  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner size="lg" /></div>;
  }

  if (!course) {
    return <div className="text-center py-12">Curso no encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a Cursos
        </Button>
        
        <div className="bg-card p-6 md:p-8 rounded-xl shadow-2xl glassmorphism mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-extrabold mb-2 gradient-text">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
            </div>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate(`/admin/edit-course/${courseId}`)} className="mt-4 md:mt-0">
                <Edit className="mr-2 h-4 w-4" /> Editar Curso
              </Button>
            )}
          </div>

          {course.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-6 border border-primary/20">
              <iframe
                className="w-full h-full"
                src={course.videoUrl.replace("watch?v=", "embed/")} 
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-6">Contenido del Curso</h2>
        <div className="space-y-4">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center">
                  {lesson.type === 'video' ? <PlayCircle className="h-6 w-6 mr-3 text-primary" /> : <FileText className="h-6 w-6 mr-3 text-primary" />}
                  <span className="text-lg">{lesson.title}</span>
                </div>
                <Button
                  variant={userProgress.includes(lesson.id) ? "secondary" : "default"}
                  onClick={() => toggleLessonComplete(lesson.id)}
                  className="group"
                >
                  {userProgress.includes(lesson.id) ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Completado
                    </>
                  ) : (
                    <>
                      Marcar como completado <CheckCircle className="ml-2 h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground">No hay lecciones disponibles para este curso todavía.</p>
          )}
        </div>

        {course.pdfUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8"
          >
            <Button asChild variant="outline" size="lg">
              <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-5 w-5" /> Descargar Material PDF
              </a>
            </Button>
          </motion.div>
        )}

        {isCourseCompleted() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
            className="mt-12 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl text-center"
          >
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">¡Felicidades! Has completado el curso.</h3>
            <p className="mb-4">Ahora puedes descargar tu certificado.</p>
            <Button variant="secondary" size="lg" onClick={generateCertificate} className="bg-white text-green-600 hover:bg-gray-100">
              <Download className="mr-2 h-5 w-5" /> Descargar Certificado
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CourseDetailPage;
  