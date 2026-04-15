import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  // 1. Create User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mayve.com' },
    update: {},
    create: {
      email: 'admin@mayve.com',
      password,
      name: 'Admin Mayve',
      role: 'admin',
    },
  });

  // 2. Create Category
  const living = await prisma.category.upsert({
    where: { slug: 'living' },
    update: {},
    create: {
      name: 'Living',
      slug: 'living',
    },
  });

  // 3. Create Product
  const product = await prisma.product.upsert({
    where: { slug: 'sillon-madera-maciza' },
    update: {},
    create: {
      name: 'Sillón Madera Maciza',
      slug: 'sillon-madera-maciza',
      description: 'Sillón artesanal de madera maciza de alta calidad.',
      price: 150000.00,
      listPrice: 175000.00,
      cashDiscountPrice: 135000.00,
      categoryId: living.id,
      inStock: true,
      isFeatured: true,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
            isMain: true,
          }
        ]
      }
    },
  });

  // 4. Site Config
  await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      whatsapp: '5491122334455',
      email: 'ventas@mayve.com',
      cashDiscount: 10,
      instagramUrl: 'https://instagram.com/mayve_muebles',
      address: 'Buenos Aires, Argentina',
      googleMapsUrl: 'https://maps.google.com',
    },
  });

  console.log('Seed finished successfully:');
  console.log({ admin: admin.email, category: living.name, product: product.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
