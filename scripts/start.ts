import readline from "readline/promises";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

marked.setOptions({
  renderer: new TerminalRenderer(),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function isValidChallenge(challenge: string) {
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

async function executeChallenge(challenge: string, input?: string) {
  const { default: challengeModule } = await import(
    `../CHALLENGE_${challenge}/index.js`
  );
  const solution = challengeModule.default(input);

  console.log("\x1b[34m%s\x1b[0m", "\nSolution: \n");
  console.log("\x1b[32m%s\x1b[0m", solution);

  await restart();
}

function renderLogo() {
  console.log(
    "\x1b[32m%s\x1b[0m",
    `
    
                  __                         __
                 /\\ \\                       /\\ \\
  ___     ___    \\_\\ \\      __     ___ ___  \\ \\ \\____     __    _  __
 /'___\\  / __\`\\  /'_\` \\   /'__\`\\ /' __\` __\`\\ \\ \\ '__\`\\  /'__\`\\ /\\\`'__\\
/\\ \\__/ /\\ \\L\\ \\/\\ \\L\\ \\ /\\  __/ /\\ \\ \\/\\ \\/\\ \\ \\ \\L\\ \\/\\  __/ \\ \\ \\/
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
  console.log("\x1b[35m\nChallenge: \x1b[0m\x1b[33m#%s", challenge);
}

async function start(challenge?:string) {
  renderLogo();

  if (!challenge || !isValidChallenge(challenge)) {
    challenge = await getValidChallenge(challenge);
  }

  renderChallengeNumber(challenge);

  if (process.argv?.includes("solution-only")) {
    await executeChallenge(challenge);
    rl.close();
    return;
  }

  renderReadMeFile(challenge);

  const useCustomInputAnswer = await rl.question(
    "Do you want to use a custom input? y/n \n",
  );
  const useCustomInput = useCustomInputAnswer.toLowerCase();
  if (useCustomInput === "yes" || useCustomInput === "y") {
    const customInputAnswer = await rl.question(
      "Please enter the custom input \n",
    );
    await executeChallenge(challenge, customInputAnswer.trim());
  } else {
    await executeChallenge(challenge);
  }

  rl.close();
}

start(formatChallenge(process.argv[2]));