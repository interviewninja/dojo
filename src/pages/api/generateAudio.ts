import { v4 as uuidv4 } from 'uuid';
import { ElevenLabsClient } from 'elevenlabs';
import { NextApiRequest, NextApiResponse } from 'next';

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

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    audio.pipe(res);
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ message: 'Error generating audio' });
  }
}