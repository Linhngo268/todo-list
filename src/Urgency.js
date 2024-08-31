import React from "react";

const Urgency = ({ urgency, setUrgency }) => {
  return (
    <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
      <option value="Non-Urgent">Non-Urgent</option>
      <option value="Urgent">Urgent</option>
      <option value="Most Urgent">Most Urgent</option>
    </select>
  );
};

export default Urgency;
