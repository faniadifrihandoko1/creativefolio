import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center text-sm md:text-base py-4 px-2  w-full "
      style={{ zIndex: 50 }} // Set zIndex to ensure it appears above other content
    >
      © 2024 Fani Adi Frihandoko. All rights reserved.
    </footer>
  );
};

export default Footer;
