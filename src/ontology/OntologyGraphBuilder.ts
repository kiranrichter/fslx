import type cytoscape from "cytoscape";
import type {OntologyClass} from "./types/OntologyClass.ts";
import type {GraphContext} from "../components/CytoscapeGraph.tsx";

export class OntologyGraphBuilder {
    private nodes = new Map<string, cytoscape.ElementDefinition>();
    private edges = new Map<string, cytoscape.ElementDefinition>();

    public build(context: GraphContext): cytoscape.ElementDefinition[] {
        this.nodes.clear();
        this.edges.clear();
        const classes = context.classes;
        const relations = context.relations;
        const visibleRelations = new Set(context.visibleRelations);
        const connectedClassIDs = new Set<string>();

        relations.forEach(relation => {
            if (!visibleRelations.has(relation.predicate)) {
                return;
            }
            connectedClassIDs.add(relation.source.id);
            connectedClassIDs.add(relation.target.id);
            this.addEdge(relation.source, relation.target, relation.predicate);
        })

        classes.forEach(clazz => {
                if (connectedClassIDs.has(clazz.id)) {
                    const size = clazz.relations.filter(r => visibleRelations.has(r.predicate)).length
                        + clazz.incomingRelations.filter(r => visibleRelations.has(r.predicate)).length;
                    this.addNode(clazz, size)
                }
            }
        )

        return [
            ...this.nodes.values(),
            ...this.edges.values()
        ];
    }

    private addEdge(source: OntologyClass, target: OntologyClass, predicate: string) {
        const id = source.id + "|" + predicate + "|" + target.id;

        this.edges.set(id, {
            data: {
                id: id,
                source: source.id,
                target: target.id,
                label: predicate,
            }
        });
    }

    private addNode(clazz: OntologyClass, size: number) {
        this.nodes.set(clazz.id, {
            data: {
                id: clazz.id,
                label: (clazz.label ?? clazz.id) + " [" + size + "]",
                clazz: clazz,
            }
        });
    }
}