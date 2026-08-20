import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PhotoLayout } from "@/components/PhotoLayout";
import { getPhotoProjectBySlug } from "@/data/photography";

export const Route = createFileRoute("/photography/$slug")({
  loader: ({ params }) => {
    const project = getPhotoProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    const title = project ? `${project.title} — Kimara` : "Photography — Kimara";
    const description = project?.description ?? "Photography series.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PhotoPage,
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
          <h1 className="font-display text-4xl">Series not found</h1>
          <p className="mt-2 text-sm text-foreground/70">
            No photography series matches "{slug}".
          </p>
          <Link to="/" className="mt-6 inline-block underline">
            Back home
          </Link>
        </div>
      </div>
    );
  },
});

function PhotoPage() {
  const { project } = Route.useLoaderData();
  return <PhotoLayout project={project} />;
}
