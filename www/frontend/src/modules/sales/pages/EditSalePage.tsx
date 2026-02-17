import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SaleForm } from '../components/SaleForm';

export function EditSalePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/sales')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Editar Venta</h1>
                    <p className="text-muted-foreground">Modificar los detalles de la venta #{id}</p>
                </div>
            </div>

            <SaleForm saleId={id} />
        </div>
    );
}
