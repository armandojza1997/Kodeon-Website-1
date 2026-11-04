import { db } from '../../src/db/index.ts';
import { services } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { checkAuth } from '../auth-util.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const allServices = await db.select().from(services).orderBy(desc(services.order));
      return res.json(allServices);
    }

    if (req.method === 'POST') {
      await checkAuth(req);
      const { id, ...data } = req.body;
      if (id) {
        const updated = await db.update(services).set(data).where(eq(services.id, id)).returning();
        return res.json(updated[0]);
      } else {
        const inserted = await db.insert(services).values(data).returning();
        return res.json(inserted[0]);
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    const status = error.message.includes('Unauthorized') ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
}
