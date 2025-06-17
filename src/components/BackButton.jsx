// src/components/BackButton.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ tooltip = 'Go Back', sx = {}, ...props }) {
  const navigate = useNavigate();

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: '#f5f5f5',
          boxShadow: 2,
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
          ...sx,
        }}
        {...props}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
}
