import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ArticleForm from "@/components/ArticleForm";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: Number(params.id) } });
  if (!article) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sửa bài viết</h1>
      <ArticleForm article={article} />
    </div>
  );
}
