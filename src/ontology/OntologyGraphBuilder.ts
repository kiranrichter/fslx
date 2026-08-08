import type cytoscape from "cytoscape";
import type {OntologyClass} from "./types/OntologyClass.ts";
import type {GraphContext} from "../components/CytoscapeGraph.tsx";

export class OntologyGraphBuilder {
    private nodes = new Map<string, cytoscape.ElementDefinition>();
    private edges: cytoscape.ElementDefinition[] = [];

    public build(context: GraphContext): cytoscape.ElementDefinition[] {
        this.nodes.clear();
        this.edges = [];
        const classes = context.classes;
        const relations = context.relations;
        const visibleRelations = context.visibleRelations;

        relations.forEach(relation => {
            if (!visibleRelations.includes(relation.predicate)) {
                return;
            }
            this.addEdge(relation.source, relation.target, relation.predicate);
        })

        classes.forEach(clazz => {
                if (relations.some(r => (r.source.id === clazz.id || r.target.id == clazz.id) && visibleRelations.includes(r.predicate))) {
                    const size = clazz.relations.filter(r => visibleRelations.includes(r.predicate)).length
                        + clazz.incomingRelations.filter(r => visibleRelations.includes(r.predicate)).length;
                    this.addNode(clazz, size)
                }
            }
        )

        return [
            ...this.nodes.values(),
            ...(this.edges)
        ];
    }

    private addEdge(source: OntologyClass, target: OntologyClass, predicate: string) {
        if (this.edges.some(e => e.data.source === source.id && e.data.target === target.id && e.data.label === predicate)) {
            return;
        }
        this.edges.push({
            data: {
                id: crypto.randomUUID(),
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