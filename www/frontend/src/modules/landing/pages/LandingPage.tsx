import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowRight, Star, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Plane className="h-6 w-6" />
                        <span>Importaciones</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/login')}>
                            Iniciar Sesión
                        </Button>
                        <Button onClick={() => navigate('/register')}>
                            Registrarse
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                <section className="flex-1 flex items-center justify-center py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
                    <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-8 relative z-10">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl">
                                Gestión integral de <br className="hidden md:block" />
                                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                    comercio exterior
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
                        >
                            Controla tus importaciones, proveedores internacionales, 
                            documentación aduanera y logística en un solo sistema.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Button size="lg" className="h-12 px-8 text-lg" onClick={() => navigate('/register')}>
                                Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={() => navigate('/login')}>
                                Ya tengo cuenta
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left"
                        >
                            <FeatureCard
                                icon={<Star className="h-6 w-6 text-yellow-500" />}
                                title="Control Total"
                                description="Gestiona todas tus importaciones desde un solo panel."
                            />
                            <FeatureCard
                                icon={<Globe className="h-6 w-6 text-green-500" />}
                                title="Proveedores Globales"
                                description="Administra tus proveedores internacionales fácilmente."
                            />
                            <FeatureCard
                                icon={<Shield className="h-6 w-6 text-blue-500" />}
                                title="Documentación Segura"
                                description="Controla documentos aduaneros y pagos de forma segura."
                            />
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="border-t py-8 bg-muted/20">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sistema de Importaciones. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 p-3 rounded-full bg-muted w-fit">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
