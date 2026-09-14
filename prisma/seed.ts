import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para generar slugs limpios
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Reemplaza espacios por -
    .replace(/[^\w-]+/g, '')  // Elimina caracteres especiales
    .replace(/--+/g, '-')     // Reemplaza múltiples - por uno solo
}

async function main() {
  console.log('🌱 Iniciando la carga masiva de los productos de DataWave...')

  const rawProducts = [
    { name: 'A6S auriculares inalambricos negros', category: 'Accesorios', price: 9000, stock: 1, description: 'Auriculares negros con estuche plastico compacto', imageUrl: '/placeholder.png' },
    { name: 'Adaptador Americano', category: 'Cable y Cargadores', price: 2000, stock: 3, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Adaptador Europeo', category: 'Cable y Cargadores', price: 2000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Afnan 9 AM Dive Eau de Parfum 100 Ml', category: 'Perfumeria', price: 49200, stock: 0, description: 'Caja celeste rectangular de carton', imageUrl: '/placeholder.png' },
    { name: 'Afnan 9 PM 100 ML', category: 'Perfumeria', price: 49900, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' },
    { name: 'Afnan 9AM 30 MI', category: 'Perfumeria', price: 19000, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' },
    { name: 'AirTag', category: 'Accesorios', price: 22000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'AirTag (Pack Individual Sellado)', category: 'Accesorios', price: 38000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'AirTag Pack x4 (Caja cerrada)', category: 'Accesorios', price: 105000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Alcatel 1 (2021) 16GB - Negro', category: 'Celulares', price: 65000, stock: 0, description: 'Producto de la categoría Celulares', imageUrl: '/placeholder.png' },
    { name: 'Alcatel 1B (2020) 16GB - Negro', category: 'Celulares', price: 55000, stock: 0, description: 'Producto de la categoría Celulares', imageUrl: '/placeholder.png' },
    { name: 'Amplificador Wifi Xiaomi Mi Range Extender Pro', category: 'Accesorios', price: 18000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Anillo Inteligente Smart Ring', category: 'Accesorios', price: 24000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Aros Con Luz Ring Light', category: 'Accesorios', price: 15000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple 30W USB-C Power Adapter', category: 'Cable y Cargadores', price: 25000, stock: 0, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple 35W Dual USB-C Port Compact Power Adapter', category: 'Cable y Cargadores', price: 28000, stock: 0, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple 67W USB-C Power Adapter', category: 'Cable y Cargadores', price: 35000, stock: 0, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple AirTag Individual', category: 'Accesorios', price: 28000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple AirPods 2da Generación', category: 'Accesorios', price: 42000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple AirPods 3ra Generación', category: 'Accesorios', price: 68000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple AirPods 4', category: 'Accesorios', price: 75000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple AirPods Pro 2da Gen USB-C', category: 'Accesorios', price: 98000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple AirPods Max', category: 'Accesorios', price: 38000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple EarPods Lightning', category: 'Accesorios', price: 15000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple EarPods Usb-C', category: 'Accesorios', price: 15000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple FineWoven Wallet con MagSafe - Negro', category: 'Accesorios', price: 12000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple Leather Wallet', category: 'Accesorios', price: 9000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple Lightning a USB-A 1m', category: 'Cable y Cargadores', price: 5000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple MagSafe Charger', category: 'Cable y Cargadores', price: 16000, stock: 3, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple Pencil 1ra Generación', category: 'Accesorios', price: 35000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple Pencil 2da Generación', category: 'Accesorios', price: 45000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple Pencil USB-C', category: 'Accesorios', price: 38000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple TV 4K (3ra Gen) 64GB', category: 'Accesorios', price: 110000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Apple USB-C 20W', category: 'Cable y Cargadores', price: 15000, stock: 6, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple USB-C a Lightning', category: 'Cable y Cargadores', price: 8000, stock: 9, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple USB-C Cable 2m', category: 'Cable y Cargadores', price: 9500, stock: 9, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch Series 10 42mm - Aluminio Negro', category: 'Relojes', price: 155000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch Series 9 41mm - Estelar', category: 'Relojes', price: 125000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch Series 9 45mm - Midnight', category: 'Relojes', price: 135000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch SE 2da Gen 40mm', category: 'Relojes', price: 95000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch SE 2da Gen 44mm', category: 'Relojes', price: 105000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch Ultra 2 49mm - Titanio', category: 'Relojes', price: 210000, stock: 0, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Apple Watch Ultra 49 mm', category: 'Relojes', price: 60000, stock: 1, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Aro de Luz Led RGB 26cm', category: 'Accesorios', price: 12000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Aro de luz para celular selfie', category: 'Accesorios', price: 3500, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Auricular vincha P9 inalambrico', category: 'Accesorios', price: 12000, stock: 3, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Auriculares Inalámbricos Lenovo LP40 Pro', category: 'Accesorios', price: 11000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Auriculares Inalámbricos TWS F9', category: 'Accesorios', price: 9500, stock: 2, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Bandolera porta celular impermeable', category: 'Accesorios', price: 11500, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Base Cooler Para Notebook', category: 'Accesorios', price: 16000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Base de Carga Inalámbrica 3 en 1 MagSafe', category: 'Cable y Cargadores', price: 28000, stock: 1, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Battery Pack 5.000 mAh', category: 'Cable y Cargadores', price: 20000, stock: 1, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cable Cargador Magnético 3 en 1 (MicroUSB/Type-C/Lightning)', category: 'Cable y Cargadores', price: 4500, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cable Conversor HDMI a VGA', category: 'Cable y Cargadores', price: 6000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cable USB a Tipo C mallado 1m', category: 'Cable y Cargadores', price: 3500, stock: 7, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Caja de sonido inalambrica TG-117', category: 'Parlantes', price: 14000, stock: 0, description: 'Producto de la categoría Parlantes', imageUrl: '/placeholder.png' },
    { name: 'Camara de seguridad Web Inteligente 1080p', category: 'Accesorios', price: 22000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Cámara Deportiva 4K Ultra HD Sumergible', category: 'Accesorios', price: 45000, stock: 0, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Cargador Auto Carga Rápida Dual USB', category: 'Cable y Cargadores', price: 4500, stock: 3, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cargador Inalámbrico Qi de Escritorio', category: 'Cable y Cargadores', price: 11000, stock: 1, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cargador Portátil Power Bank 10.000 mAh', category: 'Cable y Cargadores', price: 18000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cargador Portátil Power Bank 20.000 mAh', category: 'Cable y Cargadores', price: 28000, stock: 1, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cargador Samsung Carga Rápida 25W Original', category: 'Cable y Cargadores', price: 14000, stock: 4, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Cargador Xiaomi 120 W', category: 'Cable y Cargadores', price: 15000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Casio G-Shock', category: 'Accesorios', price: 22000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Chromecast con Google TV HD', category: 'Accesorios', price: 48000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Control Inalámbrico Joystick Bluetooth para Celular / PC', category: 'Accesorios', price: 21000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Dispositivo localizador Smart Tag Bluetooth', category: 'Accesorios', price: 7500, stock: 3, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Funda Silicona Antigolpes iPhone Varios Modelos', category: 'Accesorios', price: 4000, stock: 33, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Hub USB C 4 en 1 Adaptador multipuerto', category: 'Cable y Cargadores', price: 15000, stock: 2, description: 'Producto de la categoría Cable y Cargadores', imageUrl: '/placeholder.png' },
    { name: 'Hawas Fire 100 MI', category: 'Perfumeria', price: 29200, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' },
    { name: 'JBL Flip 6', category: 'Parlantes', price: 41000, stock: 1, description: 'Producto de la categoría Parlantes', imageUrl: '/placeholder.png' },
    { name: 'JBL GO3', category: 'Parlantes', price: 26000, stock: 1, description: 'Producto de la categoría Parlantes', imageUrl: '/placeholder.png' },
    { name: 'Jean Paul Gaultier Le Beau 100 MI', category: 'Perfumeria', price: 60800, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' },
    { name: 'K9 Micrófono Inalámbrico Doble Usb-C', category: 'Accesorios', price: 14900, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Lattafa Ramz 100 MI', category: 'Perfumeria', price: 35000, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' },
    { name: 'Luces Para Bicicleta', category: 'Accesorios', price: 20300, stock: 2, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Receptor Bluetooth', category: 'Accesorios', price: 7000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Reloj Lacoste', category: 'Relojes', price: 10000, stock: 1, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Reloj Metálico - Negro', category: 'Relojes', price: 14000, stock: 1, description: 'Producto de la categoría Relojes', imageUrl: '/placeholder.png' },
    { name: 'Soporte Laptop Chica Blanco', category: 'Accesorios', price: 9000, stock: 2, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Soporte Para Moto Impermeable', category: 'Accesorios', price: 17000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Soporte para Notebook Reforzado', category: 'Accesorios', price: 13000, stock: 3, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'USB WiFi Antena', category: 'Accesorios', price: 9000, stock: 1, description: 'Producto de la categoría Accesorios', imageUrl: '/placeholder.png' },
    { name: 'Xiaomi Mi Compact Bluetooth Speaker 2', category: 'Parlantes', price: 19000, stock: 1, description: 'Producto de la categoría Parlantes', imageUrl: '/placeholder.png' },
    { name: 'Xerjoff Erba Pura 100ml', category: 'Perfumeria', price: 85500, stock: 1, description: 'Producto de la categoría Perfumeria', imageUrl: '/placeholder.png' }
  ]

  // Extraer nombres de categorías únicas
  const uniqueCategoryNames = Array.from(new Set(rawProducts.map(p => p.category)))

  console.log(`📂 Creando / Verificando ${uniqueCategoryNames.length} categorías...`)
  
  const categoryMap = new Map<string, string>() // Nombre -> ID

  for (const catName of uniqueCategoryNames) {
    const slug = slugify(catName)
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug: slug,
      },
    })
    categoryMap.set(catName, category.id)
  }

  console.log('📦 Insertando productos...')

  for (const p of rawProducts) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) continue

    const slug = slugify(p.name)

    await prisma.product.upsert({
      where: { slug },
      update: {
        price: p.price,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl,
        categoryId: categoryId,
      },
      create: {
        name: p.name,
        slug: slug,
        price: p.price,
        stock: p.stock,
        description: p.description,
        imageUrl: p.imageUrl,
        categoryId: categoryId,
      },
    }).catch((e) => {
      console.error(`Error al insertar el producto ${p.name}:`, e.message)
    })
  }

  console.log('✅ ¡Inventario completo integrado exitosamente en Supabase!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })