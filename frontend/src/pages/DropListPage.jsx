// src/pages/DropListPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';

export default function DropListPage() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/drops')
      .then((res) => setDrops(res.data))
      .catch(() => setDrops([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading drops...</div>;

  return (
    <div>
      <h2>Active Drops</h2>
      {drops.length === 0 && <p>No active drops.</p>}
      <ul>
        {drops.map((drop) => (
          <li key={drop.id}>
            {drop.name}{' '}
            <span>
              ({new Date(drop.start_time).toLocaleString()} -{' '}
              {new Date(drop.end_time).toLocaleString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
