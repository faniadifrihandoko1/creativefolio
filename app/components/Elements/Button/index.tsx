import React from "react";

interface Props {
  type?: "button" | "submit" | "reset";
  onclick?: () => void;
  classname?: string;
  children?: React.ReactNode;
}

function Button({ type, onclick, classname, children }: Props) {
  return (
    <button type={type} onClick={onclick}  className={classname}>
      {children}
    </button>
  );
}

export default Button;
