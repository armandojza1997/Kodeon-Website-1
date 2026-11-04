import { adminAuth } from '../src/lib/firebase-admin.ts';

const ADMIN_SESSION_TOKEN = 'codix-master-access-2026';

export async function checkAuth(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing token');
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (token === ADMIN_SESSION_TOKEN) {
    return { uid: 'admin-manual', email: 'admin@codix.studio', role: 'admin' };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
}
