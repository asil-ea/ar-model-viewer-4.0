import { getModelUrl } from "@/firebase/getModel";
import Script from "next/script";
import React, { useEffect, useState } from "react";

// Register model-viewer as a valid element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<any, any>;
    }
  }
}

const ModelViewer = () => {
  const [loading, setLoading] = useState(true);
  const [modelUrl, setModelUrl] = useState("");

  useEffect(() => {
    const fetchModel = async () => {
      const url = await getModelUrl();
      setModelUrl(url);
      setLoading(false);
    };
    fetchModel();
  }, []);
  return (
    <div>
      {!loading && (
        <model-viewer
          bounds="tight"
          src={modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          environment-image="neutral"
          shadow-intensity="1" /* poster={poster} */
          tone-mapping="commerce"
        ></model-viewer>
      )}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
      />
    </div>
  );
};

export default ModelViewer;
