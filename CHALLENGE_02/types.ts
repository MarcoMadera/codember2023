export type OperationHandler = (
  value: number,
  solution: string,
) => number | string;

export enum OperationSymbol {
  INCREMENT = "#",
  DECREMENT = "@",
  SQUARE = "*",
  CONCATENATE = "&",
}
