import { INVALID_SOLUTION_INDEX } from "./constants";
import readline from "readline/promises";

export default async function (input: string, rl: readline.Interface) {
  const invalidPassWords = input.split("\n").filter((value) => {
    try {
      const [range, letter, password] = value.split(" ");
      const [min, max] = range.split("-").map((value) => parseInt(value));
      const letterToFind = letter[0];

      const count = password
        .split("")
        .filter((value) => value === letterToFind).length;

      const isValid = count >= min && count <= max;

      return !isValid;
    } catch {
      throw new Error("Invalid input, please enter a valid input");
    }
  });

  try {
    const invalidPassWordPositionAnswer = await rl.question(
      "Enter invalid password position. Press enter to use default (42). \n",
    );

    const invalidPassWordPosition = invalidPassWordPositionAnswer
      ? parseInt(invalidPassWordPositionAnswer)
      : INVALID_SOLUTION_INDEX;

    const solution =
      invalidPassWords[invalidPassWordPosition - 1].split(" ")[2];

    if (!solution) throw new Error();

    console.log(
      "\x1b[33m%s\x1b[0m",
      "Using invalid password position:",
      invalidPassWordPosition,
    );

    return solution;
  } catch {
    throw new Error("No invalid password position found");
  }
}
