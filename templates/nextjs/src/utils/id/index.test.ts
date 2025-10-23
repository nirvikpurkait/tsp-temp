import { test, expect } from "vitest";
import { generateId } from "@/utils/id";

test("Generates 8 character id when no argument passed", () => {
  const generatedId = generateId();

  expect(generatedId).toHaveLength(8);
});

test("Generates 10 character id when argument passed as 10", () => {
  const generatedId = generateId(10);

  expect(generatedId).toHaveLength(10);
});
