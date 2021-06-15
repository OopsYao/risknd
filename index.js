const puppeteer = require("puppeteer-core");
const fs = require("fs");

// Write base64String as png file
const writeFile = (day, base64Image) => {
  fs.writeFile(
    `imgs/D${day}.png`,
    base64Image.split(";base64,")[1],
    { encoding: "base64" },
    function (err) {
      if (err) return console.log(err);
      console.log(`File D${day}.png created`);
    }
  );
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
  });
  const page = await browser.newPage();
  await page.goto("https://alwe.shinyapps.io/risknd/");

  // Wait for the element loaded
  await page.waitForSelector("input#tau");
  await page.waitForSelector("#distPlot img");

  // Expose nodejs function to browser context
  await page.exposeFunction("writeFile", writeFile);

  // Query loop
  await page.evaluate(async () => {
    const queryDay = async (day) => {
      const img = document.body.querySelector("#distPlot img");
      // This async function resolves after img.src changed
      const waitForChange = () =>
        new Promise((resolve) => {
          const obser = new MutationObserver((mutationList) => {
            resolve();
            obser.disconnect();
          });
          obser.observe(img, { attributes: true });
        });
      // Trigger update via JQuery
      $("input#tau").data("ionRangeSlider").update({ from: day });
      await waitForChange();
      return img.src;
    };
    for (let day = 1; day <= 235; day++) {
      const base64Image = await queryDay(day);
      writeFile(day, base64Image);
    }
  });

  await browser.close();
})();
