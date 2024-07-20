import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method === 'POST') {
    const formData = new FormData();
    formData.append('file', req.body.file);

    try {
      const response = await axios.post('http://localhost:5000/api/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
