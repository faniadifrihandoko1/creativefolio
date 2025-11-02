"use client";
import React from "react";
import ContactItem from "./ContactItem";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const ContactInfo = () => {
  return (
    <div className="mt-5 flex flex-col gap-2 justify-center items-center">
      <p>Find me on</p>
      <div className="flex  md:flex-row gap-2 justify-center items-center">
        {" "}
        {/* flex container dengan gap 2 */}
        <ContactItem
          icon={<FaGithub size={25} />} /* icon github dengan size 25 */
          text="github" /* text dengan font size 14 */
          link="https://github.com/faniadifrihandoko1" /* link github */
        />
        <ContactItem
          icon={<MdEmail size={25} />} /* icon email dengan size 25 */
          text="email" /* text dengan font size 14 */
          link="mailto:faniadifrihandoko1@gmail.com" /* link email */
        />
      </div>
    </div>
  );
};

export default ContactInfo;
