import type {OntologyClass} from "../ontology/types/OntologyClass.ts";
import type {OntologyRelation} from "../ontology/types/OntologyRelation.ts";
import type {GraphContext, GraphRelation} from "../components/CytoscapeGraph.tsx";
import type {Ontology} from "../ontology/Ontology.ts";

export const createContext = (originClasses: OntologyClass[], ontology: Ontology, visibleRelations: string[]): GraphContext => {
    const classes = [...originClasses];
    const classIDs = new Set(classes.map(c => c.id));
    const relations: GraphRelation[] = [];
    const visiblePredicates = new Set(visibleRelations);

    function addClass(clazz: OntologyClass) {
        if (classIDs.has(clazz.id)) {
            return;
        }

        classIDs.add(clazz.id);
        classes.push(clazz);
    }

    function processRelation(relation: OntologyRelation, source: OntologyClass) {
        if (!visiblePredicates.has(relation.predicate)) {
            return;
        }

        const target = ontology.classes.get(relation.targetId);

        if (!target) {
            return;
        }

        addClass(target);
        addClass(source);

        relations.push({
            source,
            target,
            predicate: relation.predicate
        })
    }

    for (const source of originClasses) {
        for (const relation of source.relations) {
            processRelation(relation, source);
        }
        for (const incomingRelation of source.incomingRelations) {
            const sourceClass = ontology.classes.get(incomingRelation.sourceId);
            if (!sourceClass) {
                continue;
            }
            processRelation({predicate: incomingRelation.predicate, targetId: source.id}, sourceClass);
        }
    }

    return {classes, relations, visibleRelations};
};