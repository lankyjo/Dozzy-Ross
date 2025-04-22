'use client'
import { useEffect, useState } from "react";

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 3000);
    }, []);

    return (
        <section className="relative h-screen">
            <div id="video-bg" className="absolute -z-1 pointer-events-none select-none inset-0 w-full h-full">
                <iframe
                    className={`w-full h-full object-cover transition-opacity duration-500 pointer-events-none select-none ${
                        isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    src="https://www.youtube.com/embed/zm96T-_2edI?autoplay=1&mute=1&loop=1&playlist=zm96T-_2edI&controls=0&modestbranding=1&showinfo=0&rel=0&start=0&end=60&iv_load_policy=3&fs=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </div>
        </section>
    );
};

export default Hero;
