import { describe, test, expect, vi, Mock } from "vitest";

import { isValidValue } from "../scripts/bin/use-template";

describe("Use template function works properly", () => {
  describe("isValidValue operating properly", () => {
    test("returns true if value is one of the array element", () => {
      const value = "npm";
      const valueOutOf = ["npm", "pmpm", "yarn"];

      expect(isValidValue(value, valueOutOf)).toBe(true);
    });

    test("returns false if value is not one of the array element", () => {
      const value = "some";
      const valueOutOf = ["npm", "pmpm", "yarn"];

      expect(isValidValue(value, valueOutOf)).toBe(false);
    });
  });
});
