export class OntologyRelation {
    predicate: string;
    targetId: string;

    constructor(predicate: string, targetId: string) {
        this.predicate = predicate;
        this.targetId = targetId;
    }
}

export class IncomingRelation {
    predicate: string;
    sourceId: string;

    constructor(predicate: string, sourceId: string) {
        this.predicate = predicate;
        this.sourceId = sourceId;
    }
}