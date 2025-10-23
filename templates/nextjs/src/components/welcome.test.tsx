import { test, expect } from "vitest";
import { screen, render } from "@testing-library/react";
import Welcome from "@/components/welcome";

test("Next.js logo renders on page", () => {
  render(<Welcome />);

  expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
});

test("CTA button renders on page", () => {
  const aTagTextContents = [
    "Deploy now",
    "Read our docs",
    "Learn",
    "Examples",
    "Go to nextjs.org →",
  ];

  const tested_aTagTextContents: string[] = [];

  render(<Welcome />);

  const aTags = screen.getAllByRole("link");

  for (let i = 0; i < aTagTextContents.length; i++) {
    expect(aTags[i]).toBeInTheDocument();
    tested_aTagTextContents.push(aTags[i].textContent);
  }

  expect(aTagTextContents.sort()).toEqual(tested_aTagTextContents.sort());
});
