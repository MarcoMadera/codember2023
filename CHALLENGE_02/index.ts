import { join } from "path";
import { readFileSync } from "fs";
import type { OperationSymbol } from "./types";
import { operations } from "./utils";
import { INITIAL_SOLUTION, INITIAL_VALUE } from "./constants";

export default function (input?: string): string {
  const filePath = join(__dirname, "message_02.txt");
  const message = input ?? readFileSync(filePath, "utf-8");

  const { solution } = message.split("").reduce(
    ({ value, solution }, operationSymbol: OperationSymbol) => {
      if (!operations[operationSymbol]) {
        throw new Error(`Invalid operation symbol ${operationSymbol}`);
      }

      const result = operations[operationSymbol](value, solution);

      return {
        value: typeof result === "number" ? result : value,
        solution: typeof result === "string" ? result : solution,
      };
    },
    { value: INITIAL_VALUE, solution: INITIAL_SOLUTION },
  );

  return solution;
}
