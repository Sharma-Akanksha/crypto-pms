import React, { useState } from 'react';
import '../App.css'; 

const TradeSettings = () => {
  const [allocation, setAllocation] = useState(60);

  return (
    <div className="trade-settings-container">
      <div className="trade-settings-card">
        <h2 className="trade-settings-title">Allocation Percentage</h2>

        <div className="slider-section">
          <input
            type="range"
            min="0"
            max="100"
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
            className="slider"
          />
          <div className="allocation-value">{allocation}%</div>
        </div>

        <p className="note">[Mockup only: Change disabled]</p>
      </div>
    </div>
  );
};

export default TradeSettings;