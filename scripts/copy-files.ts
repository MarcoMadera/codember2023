import fs from "fs-extra";
import { globSync } from "glob";
import path from "path";

const paths = globSync(["./CHALLENGE_*/**/*.txt", "./CHALLENGE_*/**/*.md"], {});

paths.forEach((files) => {
  const relativePath = path.relative("./", files);
  const destinationFile = path.join("./dist", relativePath);

  fs.copy(files, destinationFile, { overwrite: true }, (err) => {
    if (err) {
      console.error("Error building:", err);
    }
  });
});
