"use client";
const HeaderContent = () => {
  return (
    // header content with text and icon
    <div className="flex flex-col justify-center gap-3 items-center text-center">
      {/* icon */}
      <p
        className="text-3xl md:text-5xl inline-block animate-wave"
        style={{ transformOrigin: "70% 70%" }}
      >
        👋
      </p>
      <h1 className="text-lg md:text-xl">Holla! I am Fani Adi Frihandoko,</h1>
    </div>
  );
};

export default HeaderContent;
