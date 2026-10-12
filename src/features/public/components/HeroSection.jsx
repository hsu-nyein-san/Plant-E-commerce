import React from "react";
import Container from "../../../components/Container";
import Button from "../../../components/Button";
import heroImage from "../../../assets/hero-image.jpeg";
import { Link } from "react-router-dom";



const HeroSection = () => {
  return (
    <Container>
      <section className="grid lg:grid-cols-6 md:grid-cols-8 bg-surface-card border-0 rounded-3xl shadow-soft">
      <div className="lg:col-span-4 md:col-span-5 flex-1 space-y-6 p-12 lg:pr-6">
        <h1 className="text-2xl md:text-2xl font-semibold leading-tight text-ink">
          Premium indoor plants, curated for your sanctuary
        </h1>
        <p className=" text-base text-ink-secondary">
          Transform your interiors with hand-selected plants that match your light, style, and level of care. Thoughtful packaging and expert guidance included.
        </p>
        <div className="flex text-sm flex-wrap gap-4 pt-2">
          <Link to="/shop"><Button text="Shop Plants" variant="primary"/></Link>
          <Button variant="secondary" text="Find the Right Plant" />
        </div>
        <div className="flex flex-col gap-8 md:flex-row md:gap-6 lg:flex-row lg:gap-6 text-sm text-ink-secondary pt-4">
            <p>Free potting for orders over $60</p>
            <p>Next-day delivery available</p>
        </div>
      </div>
      <div className="lg:col-span-2 md:col-span-3 w-full p-12 min-h-[420px] md:min-h-[420px]">
        <img
          src={heroImage}
          alt="Indoor plant sanctuary"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
    </section>
    </Container>
  );
};

export default HeroSection;
