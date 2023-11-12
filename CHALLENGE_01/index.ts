export default function (input: string) {
  const words = input.toLocaleLowerCase().split(" ");

  const wordCountMap = new Map<string, number>();

  for (const word of words) {
    wordCountMap.set(word, (wordCountMap.get(word) ?? 0) + 1);
  }

  const solution = Array.from(
    wordCountMap,
    ([word, count]) => `${word}${count}`,
  ).join("");

  return solution;
}
