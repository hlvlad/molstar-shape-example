import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MolstarDemoViewer } from "./MolstarDemoViewer";


const Viewer3D = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [molstarPlugin, setMolstarPlugin] = useState<MolstarDemoViewer | undefined>();

  useLayoutEffect(() => {
    if (viewerRef.current != null) {
      setMolstarPlugin(new MolstarDemoViewer(viewerRef.current));
    }
  }, [])

  useEffect(() => {
    if (molstarPlugin) {
        console.log("TEST");
        molstarPlugin.loadFigures();
    }
  }, [molstarPlugin]);


  return (
    <div id="viewer3d" ref={viewerRef} />
  )
}

export default Viewer3D;
