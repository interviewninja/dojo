// pages/api/generateAudio.tsx
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ElevenLabsClient } from 'elevenlabs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
    const audio = await elevenlabs.generate({
      voice: 'Jessica',
      text,
      model_id: 'eleven_multilingual_v2',
    });

    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(process.cwd(), 'public', 'audio', fileName);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const fileStream = fs.createWriteStream(filePath);
    audio.pipe(fileStream);

    fileStream.on('finish', () => {
      res.status(200).json({ filePath: `/audio/${fileName}` });
    });

    fileStream.on('error', (error) => {
      console.error('Error writing file:', error);
      res.status(500).json({ message: 'Error creating audio file' });
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ message: 'Error generating audio' });
  }
}