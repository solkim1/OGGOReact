import React, { createContext, useState } from "react";

export const HeaderColorContext = createContext();

export const HeaderColorProvider = ({ children }) => {
  const [headerColor, setHeaderColor] = useState("#c1e6da");
  

  return (
    <HeaderColorContext.Provider value={{ headerColor, setHeaderColor }}>
      {children}
    </HeaderColorContext.Provider>
  );
};