import type {Ontology} from "../../ontology/Ontology.ts";
import Selector from "./Selector.tsx";

type Props = {
    label: string,
    ontology: Ontology,
    value: string | null,
    onSelect: (value: string) => void,
}

// TODO: Include "Multi-Select" like PredicatesPicker.tsx - use Selector.tsx - combine PredicateSelector and PredicatePicker IF exactly the same
// TODO: Maybe only show relevant Predicates when Class(-es) selected, meaning only Predicates included in Classes relations
export default function PredicatesSelector({label, ontology, value, onSelect}: Props) {
    const predicates: string[] = ontology.allPredicates;

    return (
        <Selector
            label={value ?? label}
            headerText=""
            footerText=""
            content={predicates.map(p => ({value: p, label: p, toolTip: ""}))}
            onClickEvent={content => onSelect(content.value)}
            searchable={true}
        />
    );
}