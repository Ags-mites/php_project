import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type RootState } from '@/core/store/store';
import { documentoService } from '../services/documentoService';
import { type Documento, type DocumentoFormData } from '@/shared/schemas';
import { DocumentoForm } from '../components/DocumentoForm';

export function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<Documento | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrador';

  const fetchDocumentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await documentoService.getAll();
      setDocumentos(response.data);
    } catch {
      toast.error('Error al cargar los documentos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const filteredDocumentos = useMemo(() => {
    if (!searchTerm.trim()) return documentos;
    const term = searchTerm.toLowerCase();
    return documentos.filter((doc) =>
      doc.tipo_documento?.toLowerCase().includes(term) ||
      doc.numero_documento.toLowerCase().includes(term)
    );
  }, [documentos, searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) return;
    try {
      await documentoService.delete(id.toString());
      toast.success('Documento eliminado correctamente');
      fetchDocumentos();
    } catch {
      toast.error('Error al eliminar el documento');
    }
  };

  const handleCreate = async (data: DocumentoFormData) => {
    try {
      await documentoService.create(data);
      toast.success('Documento creado correctamente');
      fetchDocumentos();
    } catch {
      toast.error('Error al crear el documento');
    }
  };

  const handleUpdate = async (data: DocumentoFormData) => {
    if (!editingDocumento) return;
    try {
      await documentoService.update(editingDocumento.id.toString(), data);
      toast.success('Documento actualizado correctamente');
      fetchDocumentos();
    } catch {
      toast.error('Error al actualizar el documento');
    }
  };

  const handleOpenCreate = () => {
    setEditingDocumento(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (doc: Documento) => {
    setEditingDocumento(doc);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingDocumento) return null;
    return {
      id_importacion: editingDocumento.id_importacion,
      tipo_documento: editingDocumento.tipo_documento || '',
      numero_documento: editingDocumento.numero_documento,
      fecha_emision: editingDocumento.fecha_emision || '',
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Documentos Aduaneros</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Documento
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando documentos...</div>
        </div>
      ) : filteredDocumentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron documentos' : 'No hay documentos registrados'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear el primer documento
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>ID Importación</TableHead>
                <TableHead>Tipo Documento</TableHead>
                <TableHead>Número Documento</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocumentos.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>{doc.id_importacion}</TableCell>
                  <TableCell>{doc.tipo_documento || '-'}</TableCell>
                  <TableCell>{doc.numero_documento}</TableCell>
                  <TableCell>{doc.fecha_emision ? new Date(doc.fecha_emision).toLocaleDateString() : '-'}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(doc)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DocumentoForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingDocumento ? handleUpdate : handleCreate}
      />
    </div>
  );
}
