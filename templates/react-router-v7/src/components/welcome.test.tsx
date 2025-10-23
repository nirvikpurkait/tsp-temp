import { createRoutesStub } from "react-router";
import { render, screen } from "@testing-library/react";
import Welcome from "@/components/welcome";
import { test, expect } from "vitest";

test("Welcome page renders correctly", async () => {
  const Stub = createRoutesStub([{ path: "/", Component: Welcome }]);

  render(<Stub initialEntries={["/"]} />);

  expect(screen.getByText("Deploy now")).toBeInTheDocument();
});
