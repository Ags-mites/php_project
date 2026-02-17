import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SaleForm } from '../components/SaleForm';

export function CreateSalePage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/sales')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Nueva Venta</h1>
                    <p className="text-muted-foreground">Registrar una nueva venta en el sistema</p>
                </div>
            </div>

            <SaleForm />
        </div>
    );
}
