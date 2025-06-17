// components/ReusableCarousel.js

import React from 'react';
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

  return (
    <Slider {...defaultSettings} style={{ marginBottom: '2rem' }}>
      {items.map((item, index) => (
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
          <img
            src={item.image}
            alt={item.caption}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://dummyimage.com/800x300/cccccc/000000&text=Image+Unavailable';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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
      ))}
    </Slider>
  );
}
