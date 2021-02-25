import {PluginStateObject} from "molstar/lib/mol-plugin-state/objects";
import {PluginContext} from "molstar/lib/mol-plugin/context";
import {ParamDefinition as PD} from "molstar/lib/mol-util/param-definition";
import {StateTransformer} from "molstar/lib/mol-state/transformer";
import {Task} from "molstar/lib/mol-task";

import {
    TubeRepresentation,
    TubeParams
} from "./representation";

const CreateTransformer = StateTransformer.builderFactory('example-namespace');

export const CreateTube = CreateTransformer({
    name: 'create-tube',
    display: 'Tube',
    from: PluginStateObject.Root,
    to: PluginStateObject.Shape.Representation3D,
    params: {
        index: PD.Numeric(0),
        points: PD.Value([] as number[]),
        size: PD.Value(1.6)
    }
})({
    canAutoUpdate({oldParams, newParams}) {
        return true;
    },
    apply({a, params}, plugin: PluginContext) {
        return Task.create('Tube', async ctx => {
            const repr = TubeRepresentation({webgl: plugin.canvas3d?.webgl, ...plugin.representation.structure.themes}, () => TubeParams);
            await repr.createOrUpdate({}, params).runInContext(ctx);
            return new PluginStateObject.Shape.Representation3D({repr, source: a}, {label: `Tube ${params.index}`});
        });
    }
});