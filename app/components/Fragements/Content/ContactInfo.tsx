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
        <ContactItem
          icon={<FaGithub size={25} />}
          text="github"
          link="https://github.com/faniadifrihandoko1"
        />
        <ContactItem
          icon={<MdEmail size={25} />}
          text="email"
          link="mailto:faniadifrihandoko1@gmail.com"
        />
      </div>
    </div>
  );
};

export default ContactInfo;
