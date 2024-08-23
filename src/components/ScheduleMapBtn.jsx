// src/components/ScheduleMapBtn.jsx

import React from "react";

const ScheduleMapBtn = ({ handleNextPage, handlePrevPage, pageIndex, totalPages }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button onClick={handlePrevPage} disabled={pageIndex === 0}>
        {"<"}
      </button>
      <button onClick={handleNextPage} disabled={pageIndex === totalPages - 1}>
        {">"}
      </button>
    </div>
  );
};

export default ScheduleMapBtn;
