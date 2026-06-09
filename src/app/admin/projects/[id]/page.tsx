import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: Number(params.id) } });
  if (!project) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sửa công trình</h1>
      <ProjectForm project={project} />
    </div>
  );
}
