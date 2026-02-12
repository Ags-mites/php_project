const GATEWAY_URL = 'http://localhost:8080/backend/gateway';

async function login(username, password) {
    try {
        const response = await fetch(`${GATEWAY_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('username', data.username);
            return true;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = 'index.php';
}

// Login Form Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        errorMsg.classList.add('hidden');

        const success = await login(user, pass);
        if (success) {
            window.location.href = 'dashboard.php';
        } else {
            errorMsg.innerText = "Credenciales incorrectas";
            errorMsg.classList.remove('hidden');
        }
    });
}

// Dashboard Logic
async function initDashboard() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.php';
        return;
    }

    document.getElementById('app').classList.remove('hidden');

    // Set User Info
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    document.getElementById('userDisplay').innerText = username;
    document.getElementById('roleDisplay').innerText = role;

    // Role Based Visibility
    // Admin: Can manage Users, Create Students
    // Supervisor: Create Students, View Reports
    // Dev: View Logs

    if (role === 'Administrator') {
        document.getElementById('menu-users').classList.remove('hidden');
        document.getElementById('createSection').classList.remove('hidden');
    } else if (role === 'Supervisor') {
        document.getElementById('menu-reports').classList.remove('hidden');
        document.getElementById('createSection').classList.remove('hidden');
    } else if (role === 'Developer') {
        document.getElementById('menu-logs').classList.remove('hidden');
    }

    await loadStudents();

    // Setup Create Form
    const createForm = document.getElementById('createStudentForm');
    if (createForm) {
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const first = document.getElementById('newFirstName').value;
            const last = document.getElementById('newLastName').value;
            const email = document.getElementById('newEmail').value;

            await createStudent({ first_name: first, last_name: last, email: email });
        });
    }
}

async function loadStudents() {
    const tableBody = document.getElementById('studentsTableBody');
    const loading = document.getElementById('loadingText');
    const token = localStorage.getItem('token');

    loading.classList.remove('hidden');
    tableBody.innerHTML = '';

    try {
        const response = await fetch(`${GATEWAY_URL}/business/students`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            const students = data; // Logic in Service wrapper returns {data: []} or just []? Code says: ["status"=>200, "body"=> $arr]. $arr["data"][...]
            // Gateway returns the body directly?
            // forwardRequest returns $response (string).
            // So 'data' is the JSON object. 
            // Service returns array("data" => [...]).

            if (students.data && students.data.length > 0) {
                students.data.forEach(s => {
                    const row = `
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6 text-left whitespace-nowrap">${s.id}</td>
                            <td class="py-3 px-6 text-left">${s.first_name}</td>
                            <td class="py-3 px-6 text-left">${s.last_name}</td>
                            <td class="py-3 px-6 text-left">${s.email}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No hay datos</td></tr>';
            }
        } else {
            console.error('Failed to load:', data.message);
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Error: ${data.message}</td></tr>`;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.classList.add('hidden');
    }
}

async function createStudent(studentData) {
    const token = localStorage.getItem('token');
    const msg = document.getElementById('createMsg');

    try {
        const response = await fetch(`${GATEWAY_URL}/business/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(studentData)
        });

        const data = await response.json();
        if (response.ok) {
            msg.innerText = "Alumno creado con éxito!";
            msg.className = "mt-2 text-sm text-green-600";
            document.getElementById('createStudentForm').reset();
            loadStudents();
        } else {
            msg.innerText = "Error: " + data.message;
            msg.className = "mt-2 text-sm text-red-600";
        }
    } catch (e) {
        msg.innerText = "Error de red";
        msg.className = "mt-2 text-sm text-red-600";
    }
}

function reloadStudents() {
    loadStudents();
}
