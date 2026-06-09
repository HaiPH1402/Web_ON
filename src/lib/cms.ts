import { prisma } from "./prisma";

export async function getProjects() {
  return prisma.project.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getArticles() {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

// Tách body (text) thành mảng đoạn để render; dòng "## ..." là tiêu đề phụ
export function parseBody(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}
