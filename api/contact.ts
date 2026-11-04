export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, company, projectType, budget, message } = req.body || {};

    if (!name || !email || !projectType || !message) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, completa todos los campos requeridos (Nombre, Email, Tipo de Proyecto y Mensaje).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, introduce una dirección de correo electrónico válida.'
      });
    }

    const newSubmission = {
      id: `prop-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim(),
      company: company ? company.trim() : undefined,
      projectType,
      budget,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'recibido'
    };

    return res.status(200).json({
      success: true,
      message: '¡Propuesta recibida con éxito! Te responderé en un plazo máximo de 24 horas laborables.',
      proposalId: newSubmission.id,
      data: newSubmission
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
