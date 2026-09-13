import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Conectando a Supabase para cargar datos iniciales...')
  
  // Agregá aca tus inserciones, por ejemplo:
  // await prisma.user.create({ data: { name: 'Admin' } })

  console.log('✅ Seed completado con éxito.')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })