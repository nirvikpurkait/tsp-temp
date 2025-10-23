import { Outlet } from "react-router";
import type { Route } from "@/route-types/+types/root";
import RootLayout from "@/app/layout";
import RootErrorBoundary from "@/app/error";
import "@/styles/app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ ...props }: Route.ErrorBoundaryProps) {
  return <RootErrorBoundary {...props} />;
}
