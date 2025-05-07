'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');
  
  // Estados para cada tipo de usuario
  const [adminCredentials, setAdminCredentials] = useState({ name: '', password: '' });
  const [teacherCredentials, setTeacherCredentials] = useState({ email: '', password: '' });
  const [contactCredentials, setContactCredentials] = useState({ email: '', password: '' });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = '';
      let credentials = {};

      if (activeTab === 'admin') {
        endpoint = '/api/auth/login/user';
        credentials = adminCredentials;
      } else if (activeTab === 'teacher') {
        endpoint = '/api/auth/login/teacher';
        credentials = teacherCredentials;
      } else if (activeTab === 'contact') {
        endpoint = '/api/auth/login/contact';
        credentials = contactCredentials;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }
      
      // Guardar el token en localStorage y cookie
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Establecer cookie para que el middleware pueda verificar la autenticación
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}`; // 24 horas
      
      toast.success("Inicio de sesión exitoso", {
        description: `Bienvenido ${data.user.name}`,
      });

      // Redirigir al dashboard
      router.push('/dashboard');    } catch (error) {
      console.error('Error de login:', error);
      toast.error("Error de inicio de sesión", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Academia FyL</CardTitle>
        <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin">Administrador</TabsTrigger>
            <TabsTrigger value="teacher">Profesor</TabsTrigger>
            <TabsTrigger value="contact">Padre/Tutor</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Nombre de usuario</Label>
                <Input
                  id="admin-name"
                  name="name"
                  placeholder="Nombre de usuario"
                  required
                  value={adminCredentials.name}
                  onChange={handleAdminChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Contraseña</Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={adminCredentials.password}
                  onChange={handleAdminChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="teacher" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-email">Email</Label>
                <Input
                  id="teacher-email"
                  name="email"
                  type="email"
                  placeholder="profesor@academia.com"
                  required
                  value={teacherCredentials.email}
                  onChange={handleTeacherChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-password">Contraseña</Label>
                <Input
                  id="teacher-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={teacherCredentials.password}
                  onChange={handleTeacherChange}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="padre@ejemplo.com"
                  required
                  value={contactCredentials.email}
                  onChange={handleContactChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-password">Contraseña</Label>
                <Input
                  id="contact-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={contactCredentials.password}
                  onChange={handleContactChange}
                />
              </div>
            </TabsContent>

            <div className="mt-6">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Academia FyL - Todos los derechos reservados
      </CardFooter>
    </Card>
  );
}
