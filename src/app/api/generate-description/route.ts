import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { title, category, usagePeriod, originality } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const prompt = `Anda adalah seorang ahli pemasaran marketplace kampus. 
    Buatlah deskripsi produk yang menarik, persuasif, dan informatif berdasarkan data berikut:
    - Nama Barang: ${title}
    - Kategori: ${category}
    - Lama Pemakaian: ${usagePeriod}
    - Originalitas: ${originality}
    
    Instruksi tambahan:
    1. Gunakan bahasa yang santai tapi profesional (sesuai target mahasiswa).
    2. Jelaskan keunggulan barang jika kondisinya masih bagus.
    3. Jika barang non-original, tetap buat deskripsi yang jujur tapi menarik.
    4. Berikan penilaian singkat di akhir (misal: "Kondisi: 9/10, Sangat Worth It!").
    5. Jangan gunakan format markdown yang berlebihan, cukup teks paragraf.
    6. Maksimal 150 kata.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const description = completion.choices[0]?.message?.content || 'Gagal membuat deskripsi.';

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('Groq AI Error:', error);
    return NextResponse.json({ error: 'Gagal menghubungi AI' }, { status: 500 });
  }
}
