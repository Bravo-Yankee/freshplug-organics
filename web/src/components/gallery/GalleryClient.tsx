"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { galleryCategories, galleryPhotos, type GalleryCategory } from "@/content/gallery";

const IMAGES_PER_LOAD = 6;

const videos = [
  {
    id: "farm-tour",
    title: "Complete Farm Tour",
    description:
      "Take a comprehensive tour of our organic poultry farm, see our facilities, and meet our happy chickens.",
  },
  {
    id: "daily-care",
    title: "Daily Care Routine",
    description:
      "Watch how we care for our chickens daily - feeding, health checks, and ensuring their wellbeing.",
  },
  {
    id: "egg-collection",
    title: "Egg Collection Process",
    description:
      "See how we collect, clean, and package our fresh eggs to ensure maximum quality and freshness.",
  },
  {
    id: "organic-practices",
    title: "Organic Farming Practices",
    description: "Learn about our sustainable and organic farming methods that ensure healthy, happy chickens.",
  },
];

export function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory | "all">("all");
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_LOAD);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const filteredPhotos = useMemo(
    () =>
      activeFilter === "all"
        ? galleryPhotos
        : galleryPhotos.filter((photo) => photo.category === activeFilter),
    [activeFilter],
  );

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  function handleFilterChange(category: GalleryCategory | "all") {
    setActiveFilter(category);
    setVisibleCount(IMAGES_PER_LOAD);
  }

  function openLightbox(photoId: number) {
    const index = filteredPhotos.findIndex((photo) => photo.id === photoId);
    if (index !== -1) setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null || activeVideo ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, activeVideo]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      if (event.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null && i < filteredPhotos.length - 1 ? i + 1 : i));
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [lightboxIndex, filteredPhotos.length]);

  const lightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <>
      <section className="gallery-section">
        <div className="container">
          <div className="gallery-filters">
            {galleryCategories.map((category) => (
              <button
                key={category.key}
                type="button"
                className={`gallery-filter${activeFilter === category.key ? " active" : ""}`}
                onClick={() => handleFilterChange(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {visiblePhotos.map((photo) => (
              <div className="gallery-item" key={photo.id} data-category={photo.category}>
                <Image src={photo.src} alt={photo.title} width={400} height={300} />
                <div className="gallery-overlay">
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                  <button type="button" className="view-btn" onClick={() => openLightbox(photo.id)}>
                    <i className="fas fa-expand-alt" /> View Full Size
                  </button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="load-more">
              <button
                type="button"
                className="load-more-btn"
                onClick={() => setVisibleCount((count) => count + IMAGES_PER_LOAD)}
              >
                Load More Photos
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="video-section">
        <div className="container">
          <h2 className="section-title">Farm Video Tours</h2>
          <div className="video-grid">
            {videos.map((video) => (
              <div className="video-item" key={video.id}>
                <div className="video-placeholder">
                  <i className="fas fa-video" />
                  <button
                    type="button"
                    className="play-button"
                    onClick={() => setActiveVideo(video.id)}
                    aria-label={`Play ${video.title}`}
                  >
                    <i className="fas fa-play" />
                  </button>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        className={`lightbox${lightboxPhoto ? " active" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
      >
        <button type="button" className="lightbox-close" onClick={closeLightbox}>
          &times;
        </button>
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
        >
          ❮
        </button>
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={() =>
            setLightboxIndex((i) => (i !== null && i < filteredPhotos.length - 1 ? i + 1 : i))
          }
        >
          ❯
        </button>
        {lightboxPhoto && (
          // Lightbox needs the true full-size render at viewer-chosen zoom,
          // not a fixed intrinsic box — plain <img> is deliberate here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lightboxPhoto.src} alt={lightboxPhoto.title} />
        )}
      </div>

      {activeVideo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.9)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "2rem" }}>
            {videos.find((v) => v.id === activeVideo)?.title ?? "Farm Video"}
          </h2>
          <div
            style={{
              width: 600,
              maxWidth: "90vw",
              height: 400,
              background: "#333",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <div>
              <i className="fas fa-video" style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }} />
              <p>Video will be embedded here</p>
              <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>YouTube, Vimeo, or direct video file</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            style={{
              background: "var(--clay)",
              color: "white",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: 25,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
