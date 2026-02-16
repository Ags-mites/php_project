const API_URL = '/backend/gateway/business';

class Router {
    constructor() {
        this.appContent = document.getElementById('app-content');
        this.cache = {};
        this.init();
    }

    init() {
        // Load default view
        this.navigate('dashboard');
    }

    async navigate(viewName) {
        try {
            this.appContent.innerHTML = '<div class="flex justify-center items-center h-64"><span class="loading loading-spinner loading-lg"></span></div>';

            // Fetch view HTML
            if (!this.cache[viewName]) {
                const response = await fetch(`views/${viewName}.html`);
                if (!response.ok) throw new Error('View not found');
                this.cache[viewName] = await response.text();
            }

            this.appContent.innerHTML = this.cache[viewName];

            // Execute view logic
            if (viewName === 'inventory') this.initInventory();
            if (viewName === 'pos') this.initPOS();

        } catch (error) {
            console.error(error);
            this.appContent.innerHTML = '<div class="alert alert-error">Error loading view</div>';
        }
    }

    // --- VIEW CONTROLLERS ---

    // INVENTORY LOGIC
    async initInventory() {
        const tbody = document.getElementById('products-table-body');

        const loadProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products`);
                const products = await res.json();

                tbody.innerHTML = products.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td class="font-bold">${p.nombre}</td>
                        <td>${p.categoria_nombre || '-'}</td>
                        <td>${p.talla_nombre || '-'}</td>
                        <td>$${parseFloat(p.precio).toFixed(2)}</td>
                        <td>
                            <span class="badge ${p.stock < 10 ? 'badge-warning' : 'badge-success'} badge-sm">
                                ${p.stock}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-ghost btn-xs">Edit</button>
                        </td>
                    </tr>
                `).join('');
            } catch (e) {
                console.error(e);
            }
        };

        // Handle Form Submit
        const form = document.getElementById('add-product-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    const res = await fetch(`${API_URL}/products`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (res.ok) {
                        document.getElementById('add_product_modal').close();
                        form.reset();
                        loadProducts(); // Refresh
                        alert('Producto guardado');
                    } else {
                        alert('Error al guardar');
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }

        loadProducts();
    }

    // POS LOGIC
    async initPOS() {
        let cart = [];
        let products = [];
        const grid = document.getElementById('pos-grid');
        const cartTable = document.getElementById('cart-table-body');
        const totalEl = document.getElementById('cart-total');

        // Load Products
        const res = await fetch(`${API_URL}/products`);
        products = await res.json();

        // Render Grid
        grid.innerHTML = products.map(p => `
            <div class="card bg-base-100 shadow-xl compact hover:shadow-2xl transition-shadow cursor-pointer" onclick="router.addToCart(${p.id})">
                <figure class="px-4 pt-4">
                    <div class="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center text-4xl">👶</div>
                </figure>
                <div class="card-body items-center text-center p-4">
                    <h3 class="card-title text-sm">${p.nombre}</h3>
                    <p class="text-primary font-bold text-lg">$${parseFloat(p.precio).toFixed(2)}</p>
                    <div class="badge badge-outline text-xs">${p.stock} dispon.</div>
                </div>
            </div>
        `).join('');

        // Expose addToCart globally for onclick
        this.addToCart = (id) => {
            const product = products.find(p => p.id == id);
            const existing = cart.find(item => item.id == id);

            if (existing) {
                if (existing.qty < product.stock) {
                    existing.qty++;
                } else {
                    alert('No hay suficiente stock');
                }
            } else {
                cart.push({ ...product, qty: 1 });
            }
            renderCart();
        };

        const renderCart = () => {
            let total = 0;
            cartTable.innerHTML = cart.map((item, index) => {
                const subtotal = item.precio * item.qty;
                total += subtotal;
                return `
                    <tr>
                        <td>${item.nombre}</td>
                        <td>
                            <div class="join">
                                <button class="btn btn-xs join-item" onclick="router.updateQty(${index}, -1)">-</button>
                                <span class="join-item px-2 text-xs flex items-center">${item.qty}</span>
                                <button class="btn btn-xs join-item" onclick="router.updateQty(${index}, 1)">+</button>
                            </div>
                        </td>
                        <td class="text-right">$${subtotal.toFixed(2)}</td>
                        <td><button class="btn btn-ghost btn-xs text-error" onclick="router.removeCart(${index})">x</button></td>
                    </tr>
                `;
            }).join('');
            totalEl.innerText = `$${total.toFixed(2)}`;
        };

        this.updateQty = (index, change) => {
            const item = cart[index];
            if (change === 1 && item.qty >= item.stock) return alert('Max stock reached');
            item.qty += change;
            if (item.qty <= 0) cart.splice(index, 1);
            renderCart();
        };

        this.removeCart = (index) => {
            cart.splice(index, 1);
            renderCart();
        };

        document.getElementById('btn-checkout').addEventListener('click', async () => {
            if (cart.length === 0) return alert('Carrito vacío');

            const saleData = {
                total: cart.reduce((sum, item) => sum + (item.precio * item.qty), 0),
                cliente_id: 1, // Hardcoded for demo
                empleado_id: 1, // Hardcoded for demo
                detalles: cart.map(item => ({
                    producto_id: item.id,
                    cantidad: item.qty,
                    precio_unitario: item.precio
                }))
            };

            try {
                const res = await fetch(`${API_URL}/sales`, {
                    method: 'POST',
                    body: JSON.stringify(saleData),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (res.ok) {
                    alert('✅ Venta Exitosa!');
                    cart = [];
                    renderCart();
                    // Reload products to update stock
                    const pRes = await fetch(`${API_URL}/products`);
                    products = await pRes.json();
                } else {
                    const err = await res.json();
                    alert('Error: ' + err.message);
                }
            } catch (e) {
                console.error(e);
                alert('Error de conexión');
            }
        });
    }
}

const router = new Router();
