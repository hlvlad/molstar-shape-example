import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MolstarDemoViewer } from "./MolstarDemoViewer";
// import { RNAspiderTypes as RST } from "./punctures/types";

// type Viewer3DProps = {
//   model3D: string;
//   model3DName: string;
//   report: RST.RNAspiderReportRaw;
// }

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
        // molstarPlugin.loadStructureFromData(model3D, 'pdb', { dataLabel: model3DName });
        // molstarPlugin.load(report);
        console.log("TEST");
        molstarPlugin.loadFigures();
    }
  }, [molstarPlugin]);


  return (
    <div id="viewer3d" ref={viewerRef} />
  )
}

export default Viewer3D;
