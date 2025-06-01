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
