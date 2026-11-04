import { db } from '../../src/db/index.ts';
import { projects } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { checkAuth } from '../auth-util.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const allProjects = await db.select().from(projects).orderBy(desc(projects.order));
      return res.json(allProjects);
    }

    if (req.method === 'POST') {
      await checkAuth(req);
      const { id, ...data } = req.body;
      if (id) {
        const updated = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
        return res.json(updated[0]);
      } else {
        const inserted = await db.insert(projects).values(data).returning();
        return res.json(inserted[0]);
      }
    }

    if (req.method === 'DELETE') {
      await checkAuth(req);
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.delete(projects).where(eq(projects.id, parseInt(id)));
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Projects API error:', error);
    const status = error.message.includes('Unauthorized') ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
}
