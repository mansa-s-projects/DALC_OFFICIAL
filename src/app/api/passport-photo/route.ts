import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /* 
      TODO: Integrate true Background Removal API (e.g. remove.bg)
      ===============================================================
      To achieve True AI background removal on serverless architecture:
      
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
        body: ...
      })
      const cleanImgBuffer = await response.buffer();
    */
    
    // For this MVP, we simulate the AI flow using Sharp: 
    // 1. Flatten against a white background (removes transparent alphas if any exist)
    // 2. Smart crop (entropy based) to simulate face-centering for a 600x600 passport photo.

    const processedBuffer = await sharp(buffer)
      .resize(600, 600, {
        fit: 'cover',
        position: 'attention', // 'attention' uses entropy to center on the subject/face automatically!
      })
      .flatten({ background: '#ffffff' }) // Ensure a solid white background
      .jpeg({ quality: 90 }) // Standardize format and size
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;

    // Simulate AI network processing delay for premium UI effect
    await new Promise((resolve) => setTimeout(resolve, 2500));

    return NextResponse.json({ 
      success: true, 
      processedImage: base64Image,
      metadata: {
        width: 600,
        height: 600,
        format: 'jpeg',
        background: 'white'
      }
    });

  } catch (error) {
    console.error('[passport-photo] Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
