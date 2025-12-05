"use client";

import Image from "next/image";
import { StaticImageData } from "next/image";

interface PhotoLibraryCardProps {
  photoImages: StaticImageData[];
}

export function PhotoLibraryCard({ photoImages }: PhotoLibraryCardProps) {
  return (
    <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 overflow-hidden group hover:bg-white/15 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3">PHOTO LIBRARY</h3>
        <p className="text-white/90 mb-6 leading-relaxed">
          イベントの写真やメンバー撮影の写真<br />
          などを公開！
        </p>

        <div className="relative h-[400px] -mx-4 overflow-hidden">
          <div className="flex gap-3 h-full">
            <div className="flex-1 relative overflow-hidden">
              <div className="animate-scroll-slow">
                {[...photoImages.slice(0, 6), ...photoImages.slice(0, 6)].map((photo, index) => (
                  <div key={`col1-${index}`} className="mb-3">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="animate-scroll-medium">
                {[...photoImages.slice(6, 12), ...photoImages.slice(6, 12)].map((photo, index) => (
                  <div key={`col2-${index}`} className="mb-3">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Photo ${index + 7}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div className="animate-scroll-fast">
                {[...photoImages.slice(12), ...photoImages.slice(12)].map((photo, index) => (
                  <div key={`col3-${index}`} className="mb-3">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={photo}
                        alt={`Photo ${index + 13}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </div>
  );
}
