'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

export default function ProcessSwiper() {
  const steps = [
    { src: "/captures/dashboard.png", alt: "Vue d'ensemble du tableau de bord", step: "Étape 1", title: "Visualisez vos indicateurs clés" },
    { src: "/captures/cotisations.png", alt: "Gestion des cotisations", step: "Étape 2", title: "Consultez la liste de vos familles" },
    { src: "/captures/familles.png", alt: "Voir le détail d'une famille", step: "Étape 3", title: "Éditez vos familles simplement" },
    { src: "/captures/ajout.png", alt: "Ajout d'une famille", step: "Étape 4", title: "Ajoutez de nouvelles familles en quelques clics" },
    { src: "/captures/export.png", alt: "Génération d'attestation", step: "Étape 5", title: "Générez vos attestations en PDF" },
  ];

  return (
    <section className="w-full bg-[#f9f9f9] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#004d3b] mb-4">
          Découvrez Famease en 5 étapes
        </h2>

        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="w-full"
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index} className="flex flex-col items-center pb-10">
              <div className='flex flex-col items-center gap-2 w-full'>
                <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl w-full text-center mb-6">
                  <p className="text-sm text-[#00B074] font-semibold uppercase tracking-wide mb-2">{step.step}</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#004d3b] mb-2">{step.title}</h3>
                </div>
                <div className="overflow-hidden rounded-xl shadow-md w-full max-w-[800px] mx-auto">
                  <Image
                    src={step.src}
                    alt={step.alt}
                    width={800}
                    height={450}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
