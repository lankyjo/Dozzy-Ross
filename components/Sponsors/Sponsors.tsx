'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      const res = await fetch("/api/details");
      const data = await res.json();
      setSponsors(data?.sponsors || []);
    };

    fetchSponsors();
  }, []);

  return (
    <section className="py-16 bg-black text-white">
      <div className="contain grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
        {sponsors.map((sponsor: any) => {
          const img = sponsor?.sponsorsImage;
          return (
            <div key={sponsor.id} className="flex items-center justify-center">
              {img?.url && (
                <Image
                  src={img.url}
                  alt={img.alt || "sponsor logo"}
                  width={150}
                  height={img.height ?? 150}
                  className="filter grayscale"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Sponsors;
