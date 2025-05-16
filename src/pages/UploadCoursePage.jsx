
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, checkFirebaseConfig } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { UploadCloud, FileText, Video, PlusCircle, Trash2, ArrowLeft } from 'lucide-react';

const TextareaComponent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      ref={ref}
      {...props}
    />
  );
});
TextareaComponent.displayName = "Textarea";


const UploadCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [lessons, setLessons] = useState([{ id: Date.now(), title: '', type: 'video', contentUrl: '' }]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddLesson = () => {
    setLessons([...lessons, { id: Date.now(), title: '', type: 'video', contentUrl: '' }]);
  };

  const handleLessonChange = (index, field, value) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };
  
  const handleRemoveLesson = (index) => {
    const newLessons = lessons.filter((_, i) => i !== index);
    setLessons(newLessons);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkFirebaseConfig()) {
      toast({ variant: "destructive", title: "Configuración Incompleta", description: "Firebase no está configurado." });
      return;
    }
    if (!title || !description) {
      toast({ variant: "destructive", title: "Campos Requeridos", description: "Por favor, completa el título y la descripción." });
      return;
    }
    setLoading(true);

    try {
      let thumbnailUrl = '';
      if (thumbnailFile) {
        const thumbnailRef = ref(storage, `course_thumbnails/${Date.now()}_${thumbnailFile.name}`);
        await uploadBytes(thumbnailRef, thumbnailFile);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      let pdfUrl = '';
      if (pdfFile) {
        const pdfRef = ref(storage, `course_pdfs/${Date.now()}_${pdfFile.name}`);
        await uploadBytes(pdfRef, pdfFile);
        pdfUrl = await getDownloadURL(pdfRef);
      }
      
      const validLessons = lessons.filter(lesson => lesson.title.trim() !== '');

      await addDoc(collection(db, 'courses'), {
        title,
        description,
        thumbnailUrl,
        pdfUrl,
        videoUrl, // Main video URL for the course overview
        lessons: validLessons, // Array of lessons
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast({ title: "Curso Subido", description: "El nuevo curso ha sido añadido exitosamente." });
      navigate('/admin');
    } catch (error) {
      console.error("Error uploading course: ", error);
      toast({ variant: "destructive", title: "Error al Subir", description: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver al Panel
        </Button>
        <Card className="max-w-3xl mx-auto shadow-2xl glassmorphism">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto bg-primary/20 p-3 rounded-full inline-block mb-4"
            >
              <UploadCloud className="h-10 w-10 text-primary" />
            </motion.div>
            <CardTitle className="text-3xl font-bold gradient-text">Subir Nuevo Curso</CardTitle>
            <CardDescription>Completa los detalles para añadir un nuevo curso a la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Título del Curso</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <TextareaComponent id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
              </div>
              <div>
                <Label htmlFor="thumbnail">Miniatura del Curso (Imagen)</Label>
                <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
              </div>
              <div>
                <Label htmlFor="pdf">Material PDF (Opcional)</Label>
                <Input id="pdf" type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
              </div>
              <div>
                <Label htmlFor="videoUrl">URL del Video Principal (Opcional, ej. YouTube Embed)</Label>
                <Input id="videoUrl" type="url" placeholder="https://www.youtube.com/embed/VIDEO_ID" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Lecciones del Curso</h3>
                {lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="p-4 space-y-3 bg-background/50">
                    <div className="flex justify-between items-center">
                      <Label>Lección {index + 1}</Label>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveLesson(index)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`lessonTitle-${index}`}>Título de la Lección</Label>
                      <Input id={`lessonTitle-${index}`} value={lesson.title} onChange={(e) => handleLessonChange(index, 'title', e.target.value)} placeholder="Ej: Introducción a React" />
                    </div>
                    <div>
                      <Label htmlFor={`lessonType-${index}`}>Tipo de Lección</Label>
                      <select 
                        id={`lessonType-${index}`} 
                        value={lesson.type} 
                        onChange={(e) => handleLessonChange(index, 'type', e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="video">Video</option>
                        <option value="text">Texto/Artículo</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`lessonContent-${index}`}>URL del Contenido (o texto para tipo 'text')</Label>
                      {lesson.type === 'text' ? (
                        <TextareaComponent id={`lessonContent-${index}`} value={lesson.contentUrl} onChange={(e) => handleLessonChange(index, 'contentUrl', e.target.value)} placeholder="Escribe el contenido aquí..." />
                      ) : (
                        <Input id={`lessonContent-${index}`} type="url" value={lesson.contentUrl} onChange={(e) => handleLessonChange(index, 'contentUrl', e.target.value)} placeholder="https://ejemplo.com/recurso" />
                      )}
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={handleAddLesson} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Añadir Lección
                </Button>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300" disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : 'Subir Curso'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadCoursePage;
  