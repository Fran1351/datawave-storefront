export async function getProducts() {
  try {
    const mockProducts = [
      {
        id: "1",
        name: "Auriculares Inalámbricos Pro",
        description: "Cancelación de ruido activa y audio espacial de alta fidelidad.",
        price: 189900,
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        category: { name: "Audio Espacial" },
      },
      {
        id: "2",
        name: "Teclado Mecánico RGB",
        description: "Switches ópticos ultrarrápidos con chasis de aluminio pulido.",
        price: 145000,
        stock: 8,
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        category: { name: "Periféricos" },
      },
      {
        id: "3",
        name: "Monitor Gaming 4K 144Hz",
        description: "Panel OLED con tiempo de respuesta de 0.03ms y HDR1000.",
        price: 650000,
        stock: 5,
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
        category: { name: "Displays" },
      },
    ];

    return {
      success: true,
      data: mockProducts,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      data: [],
      error: "Error al obtener productos.",
    };
  }
}