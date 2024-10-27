import { DM_Serif_Display } from "next/font/google";

const bebas = DM_Serif_Display({ weight: "400", subsets: ["latin"] });
const TittleContent = () => {
  return (
    <div className="mt-2">
      <p className={`${bebas.className} text-3xl md:text-5xl lg:text-6xl `}>
        [ Frontend Developer ]
      </p>
    </div>
  );
};

export default TittleContent;
