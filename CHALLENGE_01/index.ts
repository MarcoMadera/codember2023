import { join } from "path";
import { readFileSync } from "fs";

export default function (input?: string) {
  const filePath = join(__dirname, "message_01.txt");
  const message = input ?? readFileSync(filePath, "utf-8");
  const words = message.toLocaleLowerCase().split(" ");

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
