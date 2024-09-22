import React from "react";
import Header from "../../Fragements/Content/HeaderContent";
import Description from "../../Fragements/Content/Description";
import Tittle from "../../Fragements/Content/TittleContent";
import ContactInfo from "../../Fragements/Content/ContactInfo";

const Index = () => {
  return (
    <div className="font-extrabold flex flex-col h-screen items-center justify-center">
      <Header />
      <Tittle />
      <Description />
      <ContactInfo />
    </div>
  );
};

export default Index;
