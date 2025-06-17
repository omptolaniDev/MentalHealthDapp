// File: /src/pages/api/admin/records/[id].js

import dbConnect from '../../../../lib/db';
import Record from '../../../../models/Record';

export default async function handler(req, res) {
  await dbConnect();

  const {
    method,
    query: { id },
  } = req;

  if (method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const deleted = await Record.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.status(200).json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}
