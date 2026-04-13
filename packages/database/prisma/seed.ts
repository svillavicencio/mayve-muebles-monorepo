import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const BASE_URL = 'https://mayvemuebles.divergente.digital';

async function main() {
  console.log('Seeding database...');

  // ─── Site Config ────────────────────────────────────────────────────────────
  await prisma.siteConfig.upsert({
    where: { id: '00000000-0000-0000-0000-000000000000' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000000',
      whatsapp: '5491112345678',
      email: 'info@mayvemuebles.com',
      cashDiscount: 10,
      announcementBanner: '¡Bienvenidos a Mayve Muebles! 10% de descuento en efectivo.',
    },
  });

  // ─── Admin User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@mayvemuebles.com' },
    update: {},
    create: {
      email: 'admin@mayvemuebles.com',
      password: hashedPassword,
      name: 'Admin Mayve',
      role: 'admin',
    },
  });

  // ─── Categories ────────────────────────────────────────────────────────────
  const [
    catMesasLuz,
    catMesasRatonas,
    catCristaleros,
    catBahiuts,
    catCombos,
  ] = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mesas-de-luz' },
      update: {},
      create: { name: 'Mesas de Luz', slug: 'mesas-de-luz' },
    }),
    prisma.category.upsert({
      where: { slug: 'mesas-ratonas' },
      update: {},
      create: { name: 'Mesas Ratonas', slug: 'mesas-ratonas' },
    }),
    prisma.category.upsert({
      where: { slug: 'cristaleros' },
      update: {},
      create: { name: 'Cristaleros', slug: 'cristaleros' },
    }),
    prisma.category.upsert({
      where: { slug: 'bahiuts' },
      update: {},
      create: { name: 'Bahiuts', slug: 'bahiuts' },
    }),
    prisma.category.upsert({
      where: { slug: 'combos' },
      update: {},
      create: { name: 'Combos', slug: 'combos' },
    }),
  ]);

  // ─── Products ──────────────────────────────────────────────────────────────
  const products = [
    // Individual products
    {
      name: 'Mesa de Luz',
      slug: 'mesa-de-luz',
      description:
        'Mesa de luz de pino pintada, con cajón y puerta. Diseño clásico y funcional.',
      materials: 'Pino',
      price: 230000,
      listPrice: 230000,
      cashDiscountPrice: 207000,
      isCustomizable: true,
      isFeatured: true,
      inStock: true,
      categoryId: catMesasLuz.id,
      imageUrl: `${BASE_URL}/productos/mesa-de-luz.png`,
    },
    {
      name: 'Mesas de Luz Semi Mármol',
      slug: 'mesas-de-luz-semi-marmol',
      description:
        'Par de mesas de luz con tapa simil mármol y terminación natural. Elegancia y calidez.',
      materials: 'Pino, Tapa simil mármol',
      price: 560000,
      listPrice: 560000,
      cashDiscountPrice: 504000,
      isCustomizable: true,
      isFeatured: true,
      inStock: true,
      categoryId: catMesasLuz.id,
      imageUrl: `${BASE_URL}/productos/mesas-de-luz-semi-marmol.png`,
    },
    {
      name: 'Mesa Ratona',
      slug: 'mesa-ratona',
      description:
        'Mesa ratona de pino con cajones y tapa natural. Disponible en varios colores.',
      materials: 'Pino',
      price: 260000,
      listPrice: 260000,
      cashDiscountPrice: 234000,
      isCustomizable: true,
      isFeatured: true,
      inStock: true,
      categoryId: catMesasRatonas.id,
      imageUrl: `${BASE_URL}/productos/mesas-ratonas.png`,
    },
    {
      name: 'Cristalero',
      slug: 'cristalero',
      description:
        'Cristalero de pino con puerta de vidrio y cajones. Ideal para living o comedor.',
      materials: 'Pino, Vidrio',
      price: 270000,
      listPrice: 270000,
      cashDiscountPrice: 243000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCristaleros.id,
      imageUrl: `${BASE_URL}/productos/cristaleros.png`,
    },
    {
      name: 'Cristalero RH',
      slug: 'cristalero-rh',
      description:
        'Cristalero estilo RH con puerta de vidrio, estantes y cajones inferiores.',
      materials: 'Pino, Vidrio',
      price: 310000,
      listPrice: 310000,
      cashDiscountPrice: 279000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCristaleros.id,
      imageUrl: `${BASE_URL}/productos/cristalero-rh.png`,
    },
    {
      name: 'Bahiut Americano',
      slug: 'bahiut-americano',
      description:
        'Bahiut americano de pino con puertas celosía, cajones y tapa natural. Amplio almacenamiento.',
      materials: 'Pino',
      price: 420000,
      listPrice: 420000,
      cashDiscountPrice: 378000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catBahiuts.id,
      imageUrl: `${BASE_URL}/productos/bahiut-americano.png`,
    },
    {
      name: 'Cristalero RH Grande',
      slug: 'cristalero-rh-grande',
      description:
        'Cristalero RH de mayor tamaño con puertas de vidrio y cajón inferior.',
      materials: 'Pino, Vidrio',
      price: 450000,
      listPrice: 450000,
      cashDiscountPrice: 405000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCristaleros.id,
      imageUrl: `${BASE_URL}/productos/cristaleros-rh-romano.png`,
    },
    // Combos
    {
      name: 'Combo Dormitorio',
      slug: 'combo-dormitorio',
      description:
        'Cómoda de pino + 2 mesitas de luz. Set completo para equipar tu dormitorio con estilo artesanal.',
      materials: 'Pino',
      price: 430000,
      listPrice: 430000,
      cashDiscountPrice: 387000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-dormitorio.png`,
    },
    {
      name: 'Combo Moderno TV',
      slug: 'combo-moderno-tv',
      description:
        'Rack TV + Cristalero + Mesa Ratona. Todo lo que necesitás para tu living en un solo combo.',
      materials: 'Pino',
      price: 700000,
      listPrice: 700000,
      cashDiscountPrice: 630000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-moderno-tv.png`,
    },
    {
      name: 'Combo Americano',
      slug: 'combo-americano',
      description:
        'Bahiut + Cristalero americano. Combinación clásica con gran capacidad de almacenamiento.',
      materials: 'Pino',
      price: 720000,
      listPrice: 720000,
      cashDiscountPrice: 648000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-americano.png`,
    },
    {
      name: 'Combo Moderno',
      slug: 'combo-moderno',
      description:
        'Bahiut + Cristalero + Mesa Ratona. El set completo para un living moderno y artesanal.',
      materials: 'Pino',
      price: 770000,
      listPrice: 770000,
      cashDiscountPrice: 693000,
      isCustomizable: true,
      isFeatured: true,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-moderno.png`,
    },
    {
      name: 'Combo Bahiut + 2 Cristaleros',
      slug: 'combo-bahiut-2-cristaleros',
      description:
        'Bahiut central flanqueado por 2 cristaleros laterales. Presencia total en tu comedor o living.',
      materials: 'Pino, Vidrio',
      price: 825000,
      listPrice: 825000,
      cashDiscountPrice: 742500,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-bahiut-2-cristaleros.png`,
    },
    {
      name: 'Combo Cristalero Americano + Bahiut',
      slug: 'combo-cristalero-americano-bahiut',
      description:
        'Cristalero americano + Bahiut. Estilo americano en madera de pino artesanal.',
      materials: 'Pino, Vidrio',
      price: 840000,
      listPrice: 840000,
      cashDiscountPrice: 756000,
      isCustomizable: true,
      isFeatured: false,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-cristalero-americano-bahiut.png`,
    },
    {
      name: 'Combo RH',
      slug: 'combo-rh',
      description:
        'Bahiut + Cristalero RH + Mesa Ratona. La línea premium de Mayve Muebles, inspirada en el estilo RH.',
      materials: 'Pino',
      price: 1100000,
      listPrice: 1100000,
      cashDiscountPrice: 990000,
      isCustomizable: true,
      isFeatured: true,
      inStock: true,
      categoryId: catCombos.id,
      imageUrl: `${BASE_URL}/productos/combo-rh.png`,
    },
  ];

  for (const { imageUrl, ...productData } of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        price: productData.price,
        listPrice: productData.listPrice,
        cashDiscountPrice: productData.cashDiscountPrice,
      },
    });

    // Upsert main image (skip if already exists)
    const existingImage = await prisma.image.findFirst({
      where: { productId: product.id, isMain: true },
    });

    if (!existingImage) {
      await prisma.image.create({
        data: { url: imageUrl, productId: product.id, isMain: true },
      });
    }

    console.log(`  ✓ ${product.name}`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
