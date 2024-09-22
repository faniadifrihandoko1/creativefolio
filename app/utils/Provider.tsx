import { ThemeProvider } from "next-themes";
import React from "react";

interface ProvideProps {
  children: React.ReactNode;
}
export const Provide = ({ children }: ProvideProps) => {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default Provide;
