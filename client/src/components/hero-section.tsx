import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BarChart3, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/types";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              transition: "transform 6s ease-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Kwara State Signage Agency</span>
        </div>

        <h1 className="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          {heroSlides[currentSlide].title}
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
          {heroSlides[currentSlide].subtitle}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="min-w-[180px] bg-primary text-primary-foreground"
            onClick={() => scrollToSection("billboards")}
            data-testid="button-explore-billboards"
          >
            <MapPin className="mr-2 h-5 w-5" />
            Explore Billboards
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-w-[180px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            onClick={() => scrollToSection("contact")}
            data-testid="button-contact-us"
          >
            Contact Us
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-primary/20 p-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold md:text-3xl">50+</div>
            <div className="text-sm text-white/70">Billboard Locations</div>
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-primary/20 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold md:text-3xl">2M+</div>
            <div className="text-sm text-white/70">Daily Views</div>
          </div>
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <div className="rounded-full bg-primary/20 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold md:text-3xl">Real-time</div>
            <div className="text-sm text-white/70">Analytics</div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Previous slide"
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Next slide"
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-slide-${index}`}
          />
        ))}
      </div>
    </section>
  );
}
