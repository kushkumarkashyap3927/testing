import React from 'react';
import { useParams } from 'react-router-dom';

export default function Project() {
  const { id } = useParams();
  return (
    <div>
      <h2>Project {id}</h2>
      {/* Project details for {id} */}
    </div>
  );
}
