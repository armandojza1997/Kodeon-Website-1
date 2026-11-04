import { db } from '../../src/db/index.ts';
import { users } from '../../src/db/schema.ts';
import { checkAuth } from '../auth-util.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const decodedToken: any = await checkAuth(req);
    const { uid, email } = decodedToken;
    
    const result = await db.insert(users).values({
      uid,
      email: email || '',
    }).onConflictDoUpdate({
      target: users.uid,
      set: { email: email || '' }
    }).returning();
    
    res.json({ success: true, user: result[0] });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
}
