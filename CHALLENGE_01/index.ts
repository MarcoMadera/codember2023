import * as path from "path";
import * as fs from "fs";

const filePath = path.join(__dirname, "message_01.txt");
const message = fs.readFileSync(filePath, "utf-8");
const words = message.toLocaleLowerCase().split(" ");

const wordCountMap = new Map<string, number>();

for (const word of words) {
  wordCountMap.set(word, (wordCountMap.get(word) ?? 0) + 1);
}

const solution = Array.from(
  wordCountMap,
  ([word, count]) => `${word}${count}`,
).join("");

console.log("\x1b[35m%s\x1b[0m", "The solution is:");
console.log("\x1b[32m%s\x1b[0m", solution);
