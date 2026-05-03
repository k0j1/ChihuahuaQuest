import express from 'express';
import { createServer as createViteServer } from 'vite';
import { keccak256, encodePacked, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import path from 'path';

const PORT = Number(process.env.PORT) || 3000;
const CONTRACT_ADDRESS = '0xD3260f77CD0E38a3A4e55b6666C28257714C7101';

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post('/api/sign', async (req: any, res: any) => {
    try {
      const { user, treasureIds, nonce } = req.body;

      if (!user || !Array.isArray(treasureIds) || typeof nonce !== 'number') {
        return res.status(400).json({ error: 'Invalid parameters in request body' });
      }

      const rawPrivateKey = process.env.ADMIN_PRIVATE_KEY;
      if (!rawPrivateKey) {
        return res.status(500).json({ error: 'ADMIN_PRIVATE_KEY is missing on server.' });
      }
      
      const privateKey = rawPrivateKey.startsWith('0x') ? rawPrivateKey : `0x${rawPrivateKey}`;
      let account;
      try {
          account = privateKeyToAccount(privateKey as Hex);
      } catch (e) {
          return res.status(500).json({ error: 'Invalid private key format on server.' });
      }

      const types: string[] = ['address'];
      const values: any[] = [user];

      treasureIds.forEach((id: number) => {
        types.push('uint256');
        values.push(BigInt(id));
      });

      types.push('uint256');
      values.push(BigInt(nonce));

      types.push('address');
      values.push(CONTRACT_ADDRESS);

      const message = encodePacked(types, values);
      const messageHash = keccak256(message);

      const signature = await account.signMessage({
        message: { raw: messageHash }
      });

      res.json({
        signature,
        nonce,
        messageHash
      });

    } catch (error: any) {
      console.error('Error generating signature:', error);
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Server startup failed", err);
});
