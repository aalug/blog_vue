export const getAverageColor = async (imageUrl: string): Promise<string> => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let red = 0;
        let green = 0;
        let blue = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          red += data[i];
          green += data[i + 1];
          blue += data[i + 2];
          count++;
        }

        const avgRed = Math.round(red / count);
        const avgGreen = Math.round(green / count);
        const avgBlue = Math.round(blue / count);

        const color = `rgb(${avgRed}, ${avgGreen}, ${avgBlue})`;

        resolve(color);
      }

      img.onerror = () => {
        reject(new Error("Unable to load image"));
      };
    };
  });
};
