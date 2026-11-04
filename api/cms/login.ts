import { db } from '../../src/db/index.ts';
import { users } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const ADMIN_SESSION_TOKEN = 'codix-master-access-2026';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;
  
  try {
    const foundUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = foundUsers[0];

    if (user && user.password === password) {
      res.json({ 
        success: true, 
        token: ADMIN_SESSION_TOKEN,
        user: { username: user.username, role: user.role }
      });
    } else {
      res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
}
