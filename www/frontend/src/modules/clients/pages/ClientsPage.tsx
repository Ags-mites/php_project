import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Pencil, Trash2, Plus, Package, Search } from 'lucide-react';
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
import { clientService } from '../services/clientService';
import { type Client, type ClientFormData } from '@/shared/schemas';
import { ClientForm } from '../components/ClientForm';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  const canManage = user?.role === 'Administrator' || user?.role === 'Supervisor';

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getAll();
      setClients(response.data);
    } catch {
      toast.error('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter((client) =>
      client.nombre.toLowerCase().includes(term) ||
      client.apellido.toLowerCase().includes(term) ||
      client.telefono.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.direccion.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const handleCreate = async (data: ClientFormData) => {
    try {
      await clientService.create(data);
      toast.success('Cliente creado correctamente');
      fetchClients();
    } catch {
      toast.error('Error al crear el cliente');
    }
  };

  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient) return;
    try {
      await clientService.update(editingClient.id.toString(), data);
      toast.success('Cliente actualizado correctamente');
      fetchClients();
    } catch {
      toast.error('Error al actualizar el cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    try {
      await clientService.delete(id.toString());
      toast.success('Cliente eliminado correctamente');
      fetchClients();
    } catch {
      toast.error('Error al eliminar el cliente');
    }
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setOpenDialog(true);
  };

  const getInitialData = () => {
    if (!editingClient) return null;
    return {
      nombre: editingClient.nombre,
      apellido: editingClient.apellido,
      telefono: editingClient.telefono,
      email: editingClient.email,
      direccion: editingClient.direccion,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        {canManage && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando clientes...</div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Package className="h-12 w-12 mb-4" />
          <p>{searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}</p>
          {canManage && !searchTerm && (
            <Button variant="link" onClick={handleOpenCreate}>
              Crear la primera categoría
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dirección</TableHead>
                {canManage && <TableHead className="text-right">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.apellido}</TableCell>
                  <TableCell>{client.telefono}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.direccion}</TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(client.id)}
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

      <ClientForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialData={getInitialData()}
        onSubmit={editingClient ? handleUpdate : handleCreate}
      />
    </div>
  );
}
