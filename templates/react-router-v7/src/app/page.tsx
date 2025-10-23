import Welcome from "@/components/welcome";
import type { Route } from "@/route-types/+types/page";

export const meta: Route.MetaFunction = () => [
  { title: "React Router App" },
  {
    tagName: "meta",
    name: "description",
    content: "This project is enerated with React Router v7",
  },
];

export default function Book({}: Route.ComponentProps) {
  return (
    <main>
      <Welcome />
    </main>
  );
}
