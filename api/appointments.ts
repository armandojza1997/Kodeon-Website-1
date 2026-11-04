export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET Availability or appointments
  if (req.method === 'GET') {
    const timeSlots = [
      '10:00 AM',
      '11:30 AM',
      '02:30 PM',
      '04:00 PM',
      '05:30 PM'
    ];

    const availableDays: string[] = [];
    const current = new Date();
    let added = 0;
    while (added < 10) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        availableDays.push(current.toISOString().split('T')[0]);
        added++;
      }
    }

    return res.status(200).json({
      success: true,
      timeSlots,
      availableDays
    });
  }

  // POST Schedule appointment
  if (req.method === 'POST') {
    const { name, email, date, time, serviceTopic, notes } = req.body || {};

    if (!name || !email || !date || !time || !serviceTopic) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, completa los campos requeridos: Nombre, Email, Fecha, Hora y Tema.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Dirección de correo electrónico inválida.'
      });
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newAppointment = {
      id: `CITA-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim(),
      date,
      time,
      serviceTopic,
      notes: notes ? String(notes).trim() : undefined,
      meetLink: `https://meet.google.com/aur-dev-${randomSuffix}`,
      status: 'confirmada',
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: `¡Cita confirmada con éxito para el ${date} a las ${time}!`,
      appointment: newAppointment
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
