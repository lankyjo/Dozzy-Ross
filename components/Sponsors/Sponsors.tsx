import Image from 'next/image';
import React from 'react';

const Sponsors = () => {
  return (
    <section className='bg-[#1ac1f6c] padding'>
      <div className='contain flex flex-col md:flex-row gap-10 justify-center items-center'>
        {/* Using a responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-10">
          {
            [1, 2, 3, 4, 5, 2].map((item, index) => (
              <Image
                src={`/logo${item}.png`}
                key={index}
                width={150}
                height={150}
                alt={`Sponsor ${item}`}
                className="mx-auto" // Center images within their grid cell
              />
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
