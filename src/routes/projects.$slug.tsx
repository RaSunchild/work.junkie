import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProjectLayout } from "@/components/ProjectLayout";
import { getProjectBySlug } from "@/data/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    const title = project ? `${project.title} — Kimara` : "Project — Kimara";
    const description = project?.description ?? "Project details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProjectPage,
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-foreground/70">
          {import.meta.env.DEV && error.message ? error.message : "An unexpected error occurred."}
        </p>
        <button onClick={reset} className="mt-6 underline">
          Try again
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => {
    const { slug } = Route.useParams();
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="text-center">
          <h1 className="font-display text-4xl">Project not found</h1>
          <p className="mt-2 text-sm text-foreground/70">
            No project matches "{slug}".
          </p>
          <Link to="/" className="mt-6 inline-block underline">
            Back home
          </Link>
        </div>
      </div>
    );
  },
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return <ProjectLayout project={project} />;
}
