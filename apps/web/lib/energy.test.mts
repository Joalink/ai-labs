import assert from "node:assert/strict";
import test from "node:test";
import { estimateDailyEnergyCost } from "./energy.ts";

test("calculates a deterministic daily energy cost", () => {
  assert.equal(estimateDailyEnergyCost(12.5, 0.15), 1.875);
});
