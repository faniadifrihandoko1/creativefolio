"use client";
const Description = () => {
  return (
    // description with text and text hidden on mobile
    <div className="mt-5 text-center px-4 lg:max-w-4xl md:max-w-2xl max-w-lg">
      {/* text */}
      <p className="text-base md:text-lg">
        As a digital architect, I’m ready to transform my imagination into
        virtual worlds. With my skills, I’ve crafted a variety of web projects
        that stand as digital masterpieces. I’m eager to explore the boundless
        sea of technology, tackle new challenges, and contribute to dynamic
        development teams with a fiery spirit and insatiable curiosity.
      </p>
      <p className="text-base md:text-lg mt-2 hidden md:block">
        Let&apos;s bring your ideas to life with captivating digital
        experiences!
      </p>
    </div>
  );
};

export default Description;
