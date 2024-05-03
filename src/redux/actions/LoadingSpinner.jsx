import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '69vh' }}
    >
      <CircularProgress color="inherit"
                        size={50}
                        thickness={4}
                        style={{color: "#7939ff"}}
                        />
    </div>
  );
};

export default LoadingSpinner;