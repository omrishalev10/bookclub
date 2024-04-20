import React, { useState, useEffect, useRef } from "react";

const MyCarousel = ({ items }) => {
  const [scrollRef, setScrollRef] = useState(null);
  const [scrollbarWidth, setScrollbarWidth] = useState("0%");
  const carouselRef = useRef(); // This ref attaches to the carousel container

  useEffect(() => {
    const resizeScrollbar = () => {
      if (carouselRef.current) {
        // Calculate the width of the scrollbar based on the proportion of the visible area to the total scrollable width
        const visibleWidth = carouselRef.current.clientWidth;
        const totalWidth = carouselRef.current.scrollWidth;
        const newWidth = (visibleWidth / totalWidth) * 100;
        setScrollbarWidth(`${newWidth}%`);
      }
    };

    resizeScrollbar();
    // Adjust the scrollbar width on window resize to ensure responsiveness
    window.addEventListener('resize', resizeScrollbar);

    return () => {
      window.removeEventListener('resize', resizeScrollbar);
    };
  }, [items]);

  
  const bookItemStyle = useRef(`h-full w-80 object-contain`);

  // Adjust styles for small devices to make the image adjust in size to the screen
  useEffect(() => {
    const adjustForSmallDevices = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      if (vw < 640) { // This value (640) is typically used for "small" devices in responsive design. Adjust as necessary.
        bookItemStyle.current = `h-full w-full object-contain`; // Adjust width to be full on small screens
      } else {
        bookItemStyle.current = `h-full w-80 object-contain`; // Use fixed width on larger screens
      }
    };

    adjustForSmallDevices();
    window.addEventListener('resize', adjustForSmallDevices);

    return () => {
      window.removeEventListener('resize', adjustForSmallDevices);
    };
  }, []);

  return (
    <div className="my-carousel relative w-full overflow-x-auto p-5">
      <div
        ref={(ref) => setScrollRef(ref)}
        className="flex whitespace-no-wrap scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex-none mx-2 md:mx-4 lg:mx-6 ${bookItemStyle.current}`} // Use dynamic size style here
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* You can wrap the item with an aspect ratio box if needed */}
            <div className="aspect-w-1 aspect-h-1 w-full h-full">
              {item}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCarousel;
