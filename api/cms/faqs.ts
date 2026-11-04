import { getDb } from '../../src/db/index.ts';
import { faqs } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { checkAuth } from '../auth-util.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = getDb();
    if (req.method === 'GET') {
      const allFaqs = await db.select().from(faqs).orderBy(desc(faqs.order));
      return res.json(allFaqs);
    }

    if (req.method === 'POST') {
      await checkAuth(req);
      const { id, ...data } = req.body;
      if (id) {
        const updated = await db.update(faqs).set(data).where(eq(faqs.id, id)).returning();
        return res.json(updated[0]);
      } else {
        const inserted = await db.insert(faqs).values(data).returning();
        return res.json(inserted[0]);
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('FAQs API error:', error);
    const status = error.message?.includes('Unauthorized') ? 401 : 500;
    res.status(status).json({ 
        error: error.message || 'Internal server error',
        details: error?.message 
    });
  }
}
