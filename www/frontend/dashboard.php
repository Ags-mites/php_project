<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <div id="app" class="flex h-screen hidden">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white flex flex-col transition-all duration-300">
            <div class="p-6 text-2xl font-bold border-b border-gray-700">Sistema</div>
            <nav class="flex-1 p-4">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Menú</p>
                <ul class="space-y-2">
                    <li><a href="#" class="block py-2 px-4 rounded hover:bg-gray-700 bg-gray-900">Dashboard</a></li>
                    
                    <!-- Role Based Menu Items -->
                    <li id="menu-users" class="hidden"><a href="#" class="block py-2 px-4 rounded hover:bg-gray-700">Gestionar Usuarios (Admin)</a></li>
                    <li id="menu-reports" class="hidden"><a href="#" class="block py-2 px-4 rounded hover:bg-gray-700">Reportes (Supervisor)</a></li>
                    <li id="menu-logs" class="hidden"><a href="#" class="block py-2 px-4 rounded hover:bg-gray-700">Logs del Sistema (Dev)</a></li>
                </ul>
            </nav>
            <div class="p-4 border-t border-gray-700">
                <div class="mb-2 text-sm text-gray-400">Usuario: <span id="userDisplay"></span></div>
                <button onclick="logout()" class="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm">Cerrar Sesión</button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto">
            <header class="bg-white shadow p-4 flex justify-between items-center">
                <h1 class="text-xl font-semibold text-gray-800">Dashboard de Alumnos</h1>
                <span id="roleDisplay" class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded"></span>
            </header>

            <div class="p-6">
                <!-- Content consuming Business Service -->
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold">Listado de Alumnos</h3>
                        <button onclick="reloadStudents()" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Recargar</button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full table-auto">
                            <thead>
                                <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th class="py-3 px-6 text-left">ID</th>
                                    <th class="py-3 px-6 text-left">Nombre</th>
                                    <th class="py-3 px-6 text-left">Apellido</th>
                                    <th class="py-3 px-6 text-left">Email</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody" class="text-gray-600 text-sm font-light">
                                <!-- JS Populated -->
                            </tbody>
                        </table>
                        <p id="loadingText" class="text-center py-4 text-gray-500">Cargando datos...</p>
                    </div>
                </div>

                <!-- Create Form (Visible to Admin/Supervisor) -->
                <div id="createSection" class="bg-white rounded-lg shadow p-6 hidden">
                    <h3 class="text-lg font-bold mb-4">Agregar Nuevo Alumno</h3>
                    <form id="createStudentForm" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" id="newFirstName" placeholder="Nombre" class="border p-2 rounded" required>
                        <input type="text" id="newLastName" placeholder="Apellido" class="border p-2 rounded" required>
                        <input type="email" id="newEmail" placeholder="Email" class="border p-2 rounded" required>
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
                    </form>
                    <p id="createMsg" class="mt-2 text-sm"></p>
                </div>
            </div>
        </main>
    </div>

    <script src="js/app.js"></script>
    <script>
        // Init Dashboard Logic
        document.addEventListener('DOMContentLoaded', () => {
            initDashboard();
        });
    </script>
</body>
</html>
