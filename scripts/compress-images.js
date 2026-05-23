const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const files = [
  "hero.png",
  "logo.png",
  "divi.png",
  "owl-quiz.png",
  "owl-match.png",
  "owl-empty.png",
  "owl-404.png",
  "owl-footer.png",
  "owl-chat.png",
];

async function compress() {
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const inPath = path.join("public", file);
    const outPath = path.join("public", file + ".compressed");
    if (!fs.existsSync(inPath)) {
      console.log(`SKIP ${file} (not found)`);
      continue;
    }
    const beforeBytes = fs.statSync(inPath).size;
    totalBefore += beforeBytes;

    await sharp(inPath)
      .png({ compressionLevel: 9, palette: true, quality: 80 })
      .toFile(outPath);

    const afterBytes = fs.statSync(outPath).size;
    totalAfter += afterBytes;

    fs.renameSync(outPath, inPath);

    const kbBefore = (beforeBytes / 1024).toFixed(0);
    const kbAfter = (afterBytes / 1024).toFixed(0);
    const savings = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(0);
    console.log(`${file}: ${kbBefore} KB → ${kbAfter} KB (-${savings}%)`);
  }
  console.log("---");
  console.log(
    `TOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(
      totalAfter /
      1024 /
      1024
    ).toFixed(1)} MB (-${(
      ((totalBefore - totalAfter) / totalBefore) *
      100
    ).toFixed(0)}%)`
  );
}

compress().catch((err) => {
  console.error(err);
  process.exit(1);
});
