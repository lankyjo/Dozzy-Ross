import sharp from "sharp";
import { NextResponse, NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // increase request body size limit to 5MB
    },
  },
};

// optimize image
interface OptimizeImageOptions {
  maxSizeInBytes: number;
}

async function optimizeImage(
  buffer: Buffer,
  options: OptimizeImageOptions = { maxSizeInBytes: 5 * 1024 * 1024 }
): Promise<Buffer> {
  const { maxSizeInBytes } = options;

  if (!buffer || !Buffer.isBuffer(buffer)) {
    return buffer;
  }

  // Skip optimization for small files
  if (buffer.length <= maxSizeInBytes) {
    return buffer;
  }

  try {
    return await sharp(buffer)
      .resize(2000, 2000, {
        // Resize within 2000x2000 without enlarging
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true }) // Optimize JPEG
      .toBuffer();
  } catch (error) {
    console.error("Image optimization error:", error);
    return buffer;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base64Image = body.image;

    if (!base64Image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert Base64 to Buffer
    const imageBuffer = Buffer.from(base64Image.split(",")[1], "base64");

    // Optimize and convert image to jpeg
    const optimizedBuffer = await optimizeImage(imageBuffer);

    // Convert optimized buffer back to base64
    const optimizedBase64 = `data:image/jpeg;base64,${optimizedBuffer.toString(
      "base64"
    )}`;

    return NextResponse.json({ image: optimizedBase64 });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
