import {ParamDefinition as PD} from "molstar/lib/mol-util/param-definition";
import {Representation, RepresentationContext, RepresentationParamsGetter} from "molstar/lib/mol-repr/representation";
import {Vec3} from "molstar/lib/mol-math/linear-algebra/3d";
import {MeshBuilder} from "molstar/lib/mol-geo/geometry/mesh/mesh-builder";
import {RuntimeContext} from "molstar/lib/mol-task";
import {addSphere} from "molstar/lib/mol-geo/geometry/mesh/builder/sphere";
import {addCylinder} from "molstar/lib/mol-geo/geometry/mesh/builder/cylinder";
import {ShapeRepresentation} from "molstar/lib/mol-repr/shape/representation";
import {Color} from "molstar/lib/mol-util/color/color";
import {Mesh} from "molstar/lib/mol-geo/geometry/mesh/mesh";
import {Shape} from "molstar/lib/mol-model/shape/shape";
import {DefaultCylinderProps} from "molstar/lib/mol-geo/primitive/cylinder";

/* TUBE REPRESENTATION */

interface TubeData {
  points: number[],
  size: number
  index: number
}

export const TubeParams = {
  ...Mesh.Params,
  doubleSided: PD.Boolean(true)
}
export type TubeParams = typeof TubeParams;
export type TubeProps = PD.Values<TubeParams>

const TubeVisuals = {
  'mesh': (ctx: RepresentationContext, getParams: RepresentationParamsGetter<TubeData, TubeParams>) => ShapeRepresentation(getTubeShape, Mesh.Utils)
}

function getTubeMesh(data: TubeData, props: TubeProps, mesh?: Mesh) {
  const builderState = MeshBuilder.createState(512, 256, mesh);
  //if comment out addSphere, colors and interactivity work correct
  const points = data.points;
  for(let i = 0; i < points.length - 5; i+=3) {
    addSphere(builderState, Vec3.create(points[i], points[i+1], points[i+2]), data.size, 3)
    addCylinder(builderState,
        Vec3.create(points[i], points[i+1], points[i+2]),
        Vec3.create(points[i+3], points[i+4], points[i+5]),
        1,
        {...DefaultCylinderProps, radiusTop:data.size, radiusBottom: data.size}
    )
  }
  const last_idx = data.points.length-3;
  addSphere(builderState, Vec3.create(points[last_idx], points[last_idx+1], points[last_idx+2]), data.size, 3);

  return MeshBuilder.getMesh(builderState);
}

function getTubeShape(ctx: RuntimeContext, data: TubeData, props: TubeProps, shape?: Shape<Mesh>) {
    const geo = getTubeMesh(data, props, shape && shape.geometry);
    return Shape.create(`Tube ${data.index}`, data, geo, () => Color.fromRgb(0, 255, 0), () => data.size, () => `Tube ${data.index}`);
}
export type TubeRepresentation = Representation<TubeData, TubeParams>

export function TubeRepresentation(ctx: RepresentationContext, getParams: RepresentationParamsGetter<TubeData, TubeParams>): TubeRepresentation {
  return Representation.createMulti('Tube', ctx, getParams, Representation.StateBuilder, TubeVisuals as unknown as Representation.Def<TubeData, TubeParams>)
}

/* SQUARE REPRESENTATION */

interface SquareData {
  vertices: number[],
  size: number
  index: number
}

export const SquareParams = {
  ...Mesh.Params,
  doubleSided: PD.Boolean(true)
}
export type SquareParams = typeof SquareParams;
export type SquareProps = PD.Values<SquareParams>

const SquareVisuals = {
  'mesh': (ctx: RepresentationContext, getParams: RepresentationParamsGetter<SquareData, SquareParams>) => ShapeRepresentation(getSquareShape, Mesh.Utils)
}

function getSquareMesh(data: SquareData, props: SquareProps, mesh?: Mesh) {
  // Here I'm trying to create custom mesh from plain vertices array.
  // Example array is simple square
  const state = MeshBuilder.createState(256, 128, mesh);
  for (let i = 0; i < data.vertices.length-8; i+=9) {
    MeshBuilder.addTriangle(state,
      Vec3.create(data.vertices[i], data.vertices[i + 1], data.vertices[i + 2]),
      Vec3.create(data.vertices[i + 3], data.vertices[i + 4], data.vertices[i + 5]),
      Vec3.create(data.vertices[i + 6], data.vertices[i + 7], data.vertices[i + 8]),
    );
  }
  return MeshBuilder.getMesh(state);
}

function getSquareShape(ctx: RuntimeContext, data: SquareData, props: SquareProps, shape?: Shape<Mesh>) {
    const geo = getSquareMesh(data, props, shape && shape.geometry);
    return Shape.create(`Square ${data.index}`, data, geo, () => Color.fromRgb(0, 255, 0), () => data.size, () => `Square ${data.index}`);
}
export type SquareRepresentation = Representation<SquareData, SquareParams>

export function SquareRepresentation(ctx: RepresentationContext, getParams: RepresentationParamsGetter<SquareData, SquareParams>): SquareRepresentation {
  return Representation.createMulti('Square', ctx, getParams, Representation.StateBuilder, SquareVisuals as unknown as Representation.Def<SquareData, SquareParams>)
}
