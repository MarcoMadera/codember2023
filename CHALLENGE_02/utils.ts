import { type OperationHandler, OperationSymbol } from "./types";

export const increment: OperationHandler = (value) => {
  return value + 1;
};

export const decrement: OperationHandler = (value) => {
  return value - 1;
};

export const square: OperationHandler = (value) => {
  return value * value;
};

export const concatenate: OperationHandler = (value, solution: string) => {
  return solution + value;
};

export const operations: Record<OperationSymbol, OperationHandler> = {
  [OperationSymbol.INCREMENT]: increment,
  [OperationSymbol.DECREMENT]: decrement,
  [OperationSymbol.SQUARE]: square,
  [OperationSymbol.CONCATENATE]: concatenate,
};
