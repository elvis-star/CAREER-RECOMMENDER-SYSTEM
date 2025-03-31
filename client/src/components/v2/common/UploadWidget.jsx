'use client';

import { createContext, useEffect, useState } from 'react';
import { Spin } from 'antd';

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({
  uwConfig,
  onUploadSuccess,
  setLoading,
  buttonText = 'Upload',
  buttonClassName = '',
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById('uw');
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('id', 'uw');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.addEventListener('load', () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    setLoading(true);
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          setLoading(false);
          if (!error && result && result.event === 'success') {
            console.log('Done! Here is the image info:', result.info);
            console.log('Uploaded Document URL:', result.info.secure_url);
            onUploadSuccess(result.info.secure_url);
          } else if (error) {
            console.error('Upload error:', error);
          } else if (result && result.event === 'close') {
            // User closed the widget without uploading
            setLoading(false);
          }
        }
      );

      myWidget.open();
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      {loaded ? (
        <button
          type="button"
          className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center ${buttonClassName}`}
          onClick={initializeCloudinaryWidget}
        >
          {buttonText}
        </button>
      ) : (
        <Spin size="large" />
      )}
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
