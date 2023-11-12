import readline from "readline/promises";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

function bulletListStyle(body: string, ordered: boolean) {
  const yellowColor = "\x1b[33m";
  const cyanColor = "\x1b[36m";
  const resetColor = "\x1b[0m";
  const bulletColor = ordered ? cyanColor : yellowColor;

  if (ordered) {
    let counter = 1;
    const styledBody = body.replace(/(^|\n)(\s*)\*/g, () => {
      const replacement = `\n${bulletColor}${counter}.${resetColor}`;
      counter++;
      return replacement;
    });
    return styledBody;
  }

  return body.replace(/(^|\n)(\s*)\*/g, `$1$2${bulletColor}•${resetColor}`);
}

marked.setOptions({
  renderer: new TerminalRenderer({
    list: bulletListStyle,
    tableOptions: {
      style: {
        head: ["magenta"],
        border: ["white"],
        compact: false,
      },
    },
  }),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isValidChallenge(challenge?: string) {
  const challengeDir = join(__dirname, `../CHALLENGE_${challenge}`);
  return existsSync(challengeDir);
}

async function getValidChallenge(challenge?: string) {
  if (isValidChallenge(challenge)) {
    return challenge;
  }

  if (challenge) {
    console.log(
      `Challenge ${challenge} is not valid. Please try again with a valid challenge number, e.g., '01' for challenge 1.`,
    );
  }
  const newChallenge = await getChallenge();
  return getValidChallenge(newChallenge);
}

async function getChallenge() {
  const answer = await rl.question("Please enter a challenge number \n");
  return formatChallenge(answer);
}

function formatChallenge(challenge?: string) {
  const trimmedChallenge = challenge?.trim();
  const parsedChallenge = parseInt(trimmedChallenge, 10);
  if (!isNaN(parsedChallenge)) {
    return parsedChallenge.toString().padStart(2, "0");
  }
  return trimmedChallenge;
}

async function restart() {
  const answer = await rl.question("Do you want to restart? y/n \n");
  const restartAnswer = answer.toLowerCase();
  if (restartAnswer === "yes" || restartAnswer === "y") {
    await start();
  }
  rl.close();
}

function getDefaultInput(challenge: string) {
  const challengeDir = join(__dirname, `../CHALLENGE_${challenge}`);
  const defaultInputPath = `${challengeDir}/message.txt`;
  return readFileSync(defaultInputPath, "utf-8");
}

async function executeChallenge(challenge: string, input: string) {
  try {
    if (input === null || input === undefined) {
      throw new Error("No input provided");
    }

    const { default: challengeModule } = await import(
      `../CHALLENGE_${challenge}/index.js`
    );

    const solution = challengeModule.default(input);

    console.log("\x1b[34m%s\x1b[0m", "\nSolution: \n");
    console.log("\x1b[32m%s\x1b[0m", solution, "\n");
  } catch (error) {
    if (error instanceof Error) {
      console.error("\x1b[31m%s\x1b[0m", `Execution error: ${error.message}`);
    } else {
      console.error(
        "\x1b[31m%s\x1b[0m",
        "Something went wrong while executing the challenge",
        error,
      );
    }
  } finally {
    await restart();
  }
}

function renderLogo() {
  console.log(
    "\x1b[32m%s\x1b[0m",
    `
    
                  __                         __
                 /\\ \\                       /\\ \\
  ___     ___    \\_\\ \\      __     ___ ___  \\ \\ \\____     __    _  __
 /'___\\  / __\`\\  /'_\` \\   /'__\`\\ /' __\` __\`\\ \\ \\ '__\`\\  /'__\`\\ /\\\`'__\\
/\\ \\__/ /\\ \\L\\ \\/\\ \\L\\ \\ /\\  __/ /\\ \\/\\ \\/\\ \\ \\ \\ \\L\\ \\/\\  __/ \\ \\ \\/
\\ \\____\\\\ \\____/\\ \\___,_\\\\ \\____\\\\ \\_\\ \\_\\ \\_\\ \\ \\_,__/\\ \\____\\ \\ \\_\\
 \\/____/ \\/___/  \\/__,_ / \\/____/ \\/_/\\/_/\\/_/  \\/___/  \\/____/  \\/_/
 
 `,
  );
}

function renderReadMeFile(challenge: string) {
  const challengeDir = join(__dirname, `../CHALLENGE_${challenge}`);
  const readme = readFileSync(`${challengeDir}/README.md`, "utf-8");
  const markdownContent = marked(readme);

  console.log(markdownContent);
}

function renderChallengeNumber(challenge) {
  console.log("\x1b[35m\nChallenge: \x1b[0m\x1b[33m#%s\x1b[0m", challenge);
}

function defaultInputExists(challenge: string) {
  const challengeDir = join(__dirname, `../CHALLENGE_${challenge}`);
  const defaultInputPath = `${challengeDir}/message.txt`;
  return existsSync(defaultInputPath);
}

async function getChallengeInput(challenge: string) {
  const hasDefaultInput = defaultInputExists(challenge);

  if (hasDefaultInput) {
    const useCustomInputAnswer = await rl.question(
      "Do you want to use a custom input? y/n \n",
    );
    const useCustomInput = useCustomInputAnswer.toLowerCase();

    if (useCustomInput === "yes" || useCustomInput === "y") {
      return await rl.question("Please enter your input \n");
    } else {
      return getDefaultInput(challenge);
    }
  }

  return await rl.question("Please enter your input \n");
}

async function handleSolutionOnlyExecution(challenge: string) {
  const hasDefaultInput = defaultInputExists(challenge);

  if (hasDefaultInput) {
    await executeChallenge(challenge, getDefaultInput(challenge));
    rl.close();
    return;
  }
  if (!hasDefaultInput) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "No default input file found for this challenge.",
    );
    await handleChallengeExecution(challenge);
  }
}

async function handleChallengeExecution(challenge) {
  const challengeInput = await getChallengeInput(challenge);
  await executeChallenge(challenge, challengeInput);
}

async function start(challenge?: string) {
  renderLogo();

  if (!isValidChallenge(challenge)) {
    challenge = await getValidChallenge(challenge);
  }

  renderChallengeNumber(challenge);

  const isSolutionOnly = process.argv?.includes("solution-only");

  if (isSolutionOnly) {
    return await handleSolutionOnlyExecution(challenge);
  }

  renderReadMeFile(challenge);

  await handleChallengeExecution(challenge);

  rl.close();
}

start(formatChallenge(process.argv?.[2]));
