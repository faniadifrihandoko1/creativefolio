import ContactInfo from "../components/Fragements/Content/ContactInfo";
import Description from "../components/Fragements/Content/Description";
import Header from "../components/Fragements/Content/HeaderContent";
import Tittle from "../components/Fragements/Content/TittleContent";
import Index from "../components/Pages/Home";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Fanidev",
  description: "portofolio fani",
};

export default function Home() {
  return (
    <div className="font-extrabold flex flex-col h-screen items-center justify-center ">
      <Header />
      <Tittle />
      <Description />
      <ContactInfo />
    </div>
  );
}
