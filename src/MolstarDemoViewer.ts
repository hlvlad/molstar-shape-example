import "molstar/lib/mol-util/polyfill";
import { createPlugin, DefaultPluginSpec } from "molstar/lib/mol-plugin";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginLayoutControlsDisplay } from "molstar/lib/mol-plugin/layout";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { BuiltInTrajectoryFormat } from "molstar/lib/mol-plugin-state/formats/trajectory";
// import { RNAspiderTypes, RNAspiderTypes as RST } from "./punctures/types";
// import { CreateEdge, CreatePuncture, CreateStructuralElement, CreateSurface, CreateTest } from "./punctures/behavior";
import { Vec3 } from "molstar/lib/mol-math/linear-algebra/3d";
import { createStructureRepresentationParams } from "molstar/lib/mol-plugin-state/helpers/structure-representation-params";
import { StateTransforms } from "molstar/lib/mol-plugin-state/transforms";
import {
  applyBuiltInSelection,
  StructureSelectionQueries
} from "molstar/lib/mol-plugin-state/helpers/structure-selection-query";
import Viewer3D from "./Viewer3D";
import { CreateTube } from "./cubes/behavior";

require("molstar/lib/mol-plugin-ui/skin/light.scss");


const DefaultViewerOptions = {
  layoutIsExpanded: false,
  layoutShowControls: true,
  layoutShowRemoteState: false,
  layoutShowSequence: true,
  layoutShowLeftPanel: true,
  layoutControlsDisplay: "reactive" as PluginLayoutControlsDisplay,
  disableAntialiasing: false,
  pixelScale: 1,
  enableWboit: false,

  viewportShowExpand: true,
  viewportShowSelectionMode: false,
  viewportShowAnimation: false
};
type ViewerOptions = typeof DefaultViewerOptions;

export class MolstarDemoViewer {
  plugin: PluginContext;

  constructor(element: HTMLElement, options: Partial<ViewerOptions> = {}) {
    const o = { ...DefaultViewerOptions, ...options };
    const spec: PluginSpec = {
      ...DefaultPluginSpec,
      actions: [...DefaultPluginSpec.actions],
      behaviors: [...DefaultPluginSpec.behaviors],
      animations: [...DefaultPluginSpec.animations || []],
      customParamEditors: DefaultPluginSpec.customParamEditors,
      layout: {
        initial: {
          isExpanded: o.layoutIsExpanded,
          showControls: o.layoutShowControls,
          controlsDisplay: o.layoutControlsDisplay
        },
        controls: {
          ...DefaultPluginSpec.layout && DefaultPluginSpec.layout.controls,
          top: o.layoutShowSequence ? undefined : "none",
          left: o.layoutShowLeftPanel ? undefined : "none",
          right: "none",
          bottom: "none"
        }
      },
      components: {
        ...DefaultPluginSpec.components,
        remoteState: "none"
      },
      config: [
        [PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
        [PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
        [PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode]
      ]
    }
    this.plugin = createPlugin(element, spec);
  }

  async loadStructureFromData(data: string | ArrayBuffer, format: BuiltInTrajectoryFormat, options?: { dataLabel?: string }) {
    await this.plugin.clear();
    this.plugin.behaviors.layout.leftPanelTabName.next("data");
    const _data = await this.plugin.builders.data.rawData({ data, label: options?.dataLabel });
    const trajectory = await this.plugin.builders.structure.parseTrajectory(_data, format);
    const structureBuilder = this.plugin.builders.structure;
    const model = await structureBuilder.createModel(trajectory);
    if (!model) return;
    const structure = await structureBuilder.createStructure(model);
    const components = this.plugin.build().to(structure);
    const moleculeRepr = createStructureRepresentationParams(this.plugin, void 0, {
      type: 'ball-and-stick',
      color: 'chain-id',
      size: 'uniform'
    });
    await applyBuiltInSelection(components, 'backbone')
      .apply(StateTransforms.Representation.StructureRepresentation3D, moleculeRepr).commit();
  }

  async loadFigures() {
    const structure = this.plugin.build().toRoot();
    const shapesGroup1 = structure.apply(StateTransforms.Misc.CreateGroup, { label: 'Group 1' })
    shapesGroup1.apply(CreateTube, {
      index: 1,
      points: [0, 0, 0,
               5, 7, 5,
              10, 10, 10,
              13, 16, 13],
      size: 1.6
    })
    const shapesGroup2 = structure.apply(StateTransforms.Misc.CreateGroup, { label: 'Group 2' })
    shapesGroup2.apply(CreateTube, {
      index: 1,
      points: [0, 0, 0,
               5, 7, 5,
              10, 10, 10,
              13, 16, 13],
      size: 1.6
    })
    await structure.commit();
  }
}
