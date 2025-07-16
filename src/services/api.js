const newLocal = "https://683ae95243bb370a8674205d.mockapi.io/productos/productos"
const API_URL = newLocal

export const fetchProducts = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al editar producto');
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const addProduct = async (data) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al agregar producto');
    return await res.json();
  } catch (error) {
    throw error;
  }
};
