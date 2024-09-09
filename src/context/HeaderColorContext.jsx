import React, { createContext, useState } from "react";

/**
 * HeaderColorContext.
 * 헤더 색상을 관리하기 위한 컨텍스트를 생성합니다.
 */
export const HeaderColorContext = createContext();

/**
 * HeaderColorProvider 컴포넌트.
 * 헤더 색상을 변경할 수 있도록 전역 상태를 제공합니다.
 *
 * @param {Object} props - 컴포넌트의 props.
 * @param {React.ReactNode} props.children - 자식 컴포넌트들.
 * @return {JSX.Element} HeaderColorProvider 컴포넌트를 반환합니다.
 */
export const HeaderColorProvider = ({ children }) => {
  const [headerColor, setHeaderColor] = useState("#c1e6da"); // 헤더 색상 상태

  return <HeaderColorContext.Provider value={{ headerColor, setHeaderColor }}>{children}</HeaderColorContext.Provider>;
};
