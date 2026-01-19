import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Important: Next.js 13+ App Router config to handle larger files
export const maxDuration = 60; // 60 seconds
export const dynamic = 'force-dynamic';

// Configure Cloudinary using your existing env variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  try {
    // 1. Check for configuration
    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary API Secret is missing from environment variables." },
        { status: 503 }
      );
    }

    // 2. Extract file from FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    // 4. Convert file to Buffer for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Upload to Cloudinary using a Promise (Cloudinary v2 uses callbacks)
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "kuuslauk",
          resource_type: "image",
          transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" }
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    }) as any;

    // 6. Return the secure URL to the frontend
    return NextResponse.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
    });

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to upload to Cloudinary. Check server logs." },
      { status: 500 }
    );
  }
}

// DELETE - Remove image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({ 
      success: result.result === "ok",
      result: result.result 
    });
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}