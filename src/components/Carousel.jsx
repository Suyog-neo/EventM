import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ReusableCarousel({ items, heightSettings, settings }) {
  const defaultHeight = heightSettings || { xs: 220, sm: 300, md: 400 };

  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
    arrows: true,
    ...settings,
  };

  // Default blurred placeholder
  const defaultBlur =
    'data:image/svg+xml;utf8,<svg width="800" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="300" fill="%23cccccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%23666">Loading...</text></svg>';

  return (
    <Slider {...defaultSettings} style={{ marginBottom: '2rem' }}>
      {items.map((item, index) => {
        const [loaded, setLoaded] = useState(false);
        const isFirst = index === 0;
        return (
          <Box
            key={index}
            sx={{
              position: 'relative',
              height: defaultHeight,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 3,
            }}
          >
            {/* Blurred placeholder */}
            <img
              src={item.placeholder || defaultBlur}
              alt="placeholder"
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'blur(16px)',
                opacity: loaded ? 0 : 1,
                transition: 'opacity 0.5s',
                zIndex: 1,
              }}
            />
            {/* Main image */}
            <img
              src={item.image}
              alt={item.caption}
              loading={isFirst ? undefined : "lazy"}
              fetchpriority={isFirst ? "high" : undefined}
              width="800"
              height="300"
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://dummyimage.com/800x300/cccccc/000000&text=Image+Unavailable';
                setLoaded(true);
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.5s',
                position: 'relative',
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))',
                color: 'white',
                p: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {item.caption}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Slider>
  );
}
