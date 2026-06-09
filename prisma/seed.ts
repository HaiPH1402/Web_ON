import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SITE } from "../src/lib/site";
import { PROJECTS, NEWS } from "../src/lib/content";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu...");

  // Xóa dữ liệu cũ (theo thứ tự khóa ngoại)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.priceTier.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.project.deleteMany();
  await prisma.article.deleteMany();

  // ----- Cấu hình site (Setting) -----
  for (const [key, value] of Object.entries(SITE)) {
    await prisma.setting.create({ data: { key, value: String(value) } });
  }
  console.log("✔ Tạo cấu hình site");

  // ----- Công trình tiêu biểu (Project) -----
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    await prisma.project.create({
      data: {
        title: p.title,
        location: p.location,
        scope: p.scope,
        year: p.year,
        tag: p.tag,
        image: p.image,
        sortOrder: i,
      },
    });
  }
  console.log(`✔ Tạo ${PROJECTS.length} công trình`);

  // ----- Tin tức (Article) -----
  for (const a of NEWS) {
    await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        author: a.author,
        image: a.image,
        body: a.body.join("\n\n"),
        publishedAt: new Date(a.date),
      },
    });
  }
  console.log(`✔ Tạo ${NEWS.length} bài viết`);

  // ----- Tài khoản quản trị (khách mua hàng không cần đăng nhập) -----
  await prisma.user.create({
    data: {
      email: "admin@ongnuoc.vn",
      password: await bcrypt.hash("admin123", 10),
      name: "Quản trị viên",
      role: "ADMIN",
      phone: "0900000000",
    },
  });
  console.log("✔ Tạo tài khoản admin");

  // ----- Thương hiệu -----
  const brandNames = ["Bình Minh", "Tiền Phong", "Hoa Sen", "Dekko"];
  const brands: Record<string, number> = {};
  for (const name of brandNames) {
    const b = await prisma.brand.create({ data: { name, slug: slugify(name) } });
    brands[name] = b.id;
  }

  // ----- Danh mục -----
  const catData = [
    { name: "Ống nhựa uPVC", slug: "ong-upvc", image: "/products/upvc.jpg" },
    { name: "Ống HDPE", slug: "ong-hdpe", image: "/products/hdpe.jpg" },
    { name: "Ống PPR (nước nóng)", slug: "ong-ppr", image: "/products/ppr.jpg" },
    { name: "Ống thép / Inox", slug: "ong-thep-inox", image: "/products/thep.jpg" },
    { name: "Phụ kiện (co, nối, tê)", slug: "phu-kien", image: "/products/phukien.jpg" },
    { name: "Van & Thiết bị", slug: "van-thiet-bi", image: "/products/van.jpg" },
  ];
  const cats: Record<string, number> = {};
  for (const c of catData) {
    const cat = await prisma.category.create({ data: c });
    cats[c.slug] = cat.id;
  }
  console.log("✔ Tạo danh mục & thương hiệu");

  // ----- Sản phẩm -----
  const products = [
    {
      name: "Ống nhựa uPVC Bình Minh Ø60 Class 1",
      categorySlug: "ong-upvc", brand: "Bình Minh",
      material: "uPVC", diameter: "Ø60", pressure: "Class 1", standard: "TCVN 8491",
      unit: "cây", packaging: "Cây 4m", retailPrice: 85000, wholesalePrice: 76000,
      stock: 320, featured: true,
    },
    {
      name: "Ống nhựa uPVC Bình Minh Ø90 Class 2",
      categorySlug: "ong-upvc", brand: "Bình Minh",
      material: "uPVC", diameter: "Ø90", pressure: "Class 2", standard: "TCVN 8491",
      unit: "cây", packaging: "Cây 4m", retailPrice: 175000, wholesalePrice: 158000,
      stock: 210, featured: true,
    },
    {
      name: "Ống nhựa uPVC Tiền Phong Ø114 Class 3",
      categorySlug: "ong-upvc", brand: "Tiền Phong",
      material: "uPVC", diameter: "Ø114", pressure: "Class 3", standard: "TCVN 8491",
      unit: "cây", packaging: "Cây 4m", retailPrice: 295000, wholesalePrice: 270000,
      stock: 95,
    },
    {
      name: "Ống HDPE Tiền Phong DN63 PN10",
      categorySlug: "ong-hdpe", brand: "Tiền Phong",
      material: "HDPE", diameter: "DN63", pressure: "PN10", standard: "ISO 4427",
      unit: "mét", packaging: "Cuộn 100m", retailPrice: 32000, wholesalePrice: 28500,
      stock: 1500, featured: true,
    },
    {
      name: "Ống HDPE Tiền Phong DN110 PN16",
      categorySlug: "ong-hdpe", brand: "Tiền Phong",
      material: "HDPE", diameter: "DN110", pressure: "PN16", standard: "ISO 4427",
      unit: "mét", packaging: "Cây 6m", retailPrice: 98000, wholesalePrice: 90000,
      stock: 600,
    },
    {
      name: "Ống PPR Dekko DN20 PN20 (nước nóng)",
      categorySlug: "ong-ppr", brand: "Dekko",
      material: "PPR", diameter: "DN20", pressure: "PN20", standard: "ISO 15874",
      unit: "cây", packaging: "Cây 4m", retailPrice: 42000, wholesalePrice: 37000,
      stock: 800, featured: true,
    },
    {
      name: "Ống PPR Dekko DN25 PN20 (nước nóng)",
      categorySlug: "ong-ppr", brand: "Dekko",
      material: "PPR", diameter: "DN25", pressure: "PN20", standard: "ISO 15874",
      unit: "cây", packaging: "Cây 4m", retailPrice: 58000, wholesalePrice: 51000,
      stock: 540,
    },
    {
      name: "Ống thép mạ kẽm Hoa Sen DN27 (phi 27)",
      categorySlug: "ong-thep-inox", brand: "Hoa Sen",
      material: "Thép mạ kẽm", diameter: "DN27", pressure: "—", standard: "TCVN 3783",
      unit: "cây", packaging: "Cây 6m", retailPrice: 165000, wholesalePrice: 152000,
      stock: 180,
    },
    {
      name: "Ống inox 304 Ø34 dày 1.2mm",
      categorySlug: "ong-thep-inox", brand: "Hoa Sen",
      material: "Inox 304", diameter: "Ø34", pressure: "—", standard: "ASTM A312",
      unit: "cây", packaging: "Cây 6m", retailPrice: 320000, wholesalePrice: 298000,
      stock: 70,
    },
    {
      name: "Cút (co) 90° uPVC Bình Minh Ø60",
      categorySlug: "phu-kien", brand: "Bình Minh",
      material: "uPVC", diameter: "Ø60", pressure: "—", standard: "TCVN",
      unit: "cái", packaging: "Túi 10 cái", retailPrice: 9500, wholesalePrice: 8000,
      stock: 2400, featured: true,
    },
    {
      name: "Tê (T) uPVC Bình Minh Ø90",
      categorySlug: "phu-kien", brand: "Bình Minh",
      material: "uPVC", diameter: "Ø90", pressure: "—", standard: "TCVN",
      unit: "cái", packaging: "Túi 5 cái", retailPrice: 18000, wholesalePrice: 15500,
      stock: 1300,
    },
    {
      name: "Măng sông (nối thẳng) PPR Dekko DN25",
      categorySlug: "phu-kien", brand: "Dekko",
      material: "PPR", diameter: "DN25", pressure: "PN20", standard: "ISO",
      unit: "cái", packaging: "Túi 10 cái", retailPrice: 7000, wholesalePrice: 5800,
      stock: 3000,
    },
    {
      name: "Van bi nhựa uPVC Bình Minh Ø60",
      categorySlug: "van-thiet-bi", brand: "Bình Minh",
      material: "uPVC", diameter: "Ø60", pressure: "PN10", standard: "TCVN",
      unit: "cái", packaging: "Hộp 1 cái", retailPrice: 78000, wholesalePrice: 69000,
      stock: 250,
    },
    {
      name: "Van cổng đồng DN27 (phi 27)",
      categorySlug: "van-thiet-bi", brand: "Hoa Sen",
      material: "Đồng", diameter: "DN27", pressure: "PN16", standard: "—",
      unit: "cái", packaging: "Hộp 1 cái", retailPrice: 135000, wholesalePrice: 122000,
      stock: 140, featured: true,
    },
    {
      name: "Đồng hồ nước Ø21 (phi 21)",
      categorySlug: "van-thiet-bi", brand: "Hoa Sen",
      material: "Đồng/Composite", diameter: "Ø21", pressure: "—", standard: "ISO 4064",
      unit: "cái", packaging: "Hộp 1 cái", retailPrice: 210000, wholesalePrice: 195000,
      stock: 60,
    },
  ];

  // Ảnh theo danh mục (đã tải về /public/products)
  const imageByCat: Record<string, string> = {
    "ong-upvc": "/products/upvc.jpg",
    "ong-hdpe": "/products/hdpe.jpg",
    "ong-ppr": "/products/ppr.jpg",
    "ong-thep-inox": "/products/thep.jpg",
    "phu-kien": "/products/phukien.jpg",
    "van-thiet-bi": "/products/van.jpg",
  };

  let count = 0;
  for (const p of products) {
    // Đồng hồ nước dùng ảnh riêng
    const imageUrl = p.name.includes("Đồng hồ")
      ? "/products/dongho.jpg"
      : imageByCat[p.categorySlug] ?? "/products/upvc.jpg";
    const product = await prisma.product.create({
      data: {
        sku: "SP" + String(1000 + count),
        name: p.name,
        slug: slugify(p.name) + "-" + (1000 + count),
        description: `${p.name}. Vật liệu ${p.material}, đường kính ${p.diameter}, tiêu chuẩn ${p.standard}. Hàng chính hãng, đầy đủ CO/CQ.`,
        material: p.material,
        diameter: p.diameter,
        pressure: p.pressure,
        standard: p.standard,
        unit: p.unit,
        packaging: p.packaging,
        imageUrl,
        retailPrice: p.retailPrice,
        wholesalePrice: p.wholesalePrice,
        stock: p.stock,
        isFeatured: p.featured ?? false,
        categoryId: cats[p.categorySlug],
        brandId: brands[p.brand],
        priceTiers: {
          create: [
            { minQty: 50, price: Math.round(p.retailPrice * 0.92) },
            { minQty: 200, price: p.wholesalePrice ?? Math.round(p.retailPrice * 0.88) },
          ],
        },
      },
    });
    count++;
    void product;
  }
  console.log(`✔ Tạo ${count} sản phẩm`);
  console.log("✅ Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
