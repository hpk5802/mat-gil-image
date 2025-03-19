const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const axios = require("axios");

const dataDir = path.join(__dirname, "data");
const outputDir = path.join(__dirname, "public", "images");

// JSON 파일을 순회하며 thumbnail URL의 이미지를 최적화하는 함수
async function processImages() {
  const files = fs.readdirSync(dataDir);

  for (const file of files) {
    if (path.extname(file) === ".json") {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      for (const item of data) {
        if (item.thumbnail) {
          try {
            const response = await axios.get(item.thumbnail, {
              responseType: "arraybuffer",
            });
            const imageBuffer = Buffer.from(response.data);

            // 파일 이름 생성 로직 수정
            const url = item.thumbnail;
            const fileName =
              url
                .replace("https://i.ytimg.com/vi/", "")
                .replace("/hqdefault.jpg", "") + ".webp";
            const outputFilePath = path.join(outputDir, fileName);

            await sharp(imageBuffer)
              .resize(350)
              .webp({ quality: 80 })
              .toFile(outputFilePath);

            console.log(`Processed and saved: ${outputFilePath}`);
          } catch (error) {
            console.error(`Error processing ${item.thumbnail}:`, error.message);
          }
        }
      }
    }
  }
}

processImages().catch(console.error);
