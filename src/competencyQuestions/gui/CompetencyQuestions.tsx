import {useEffect, useState} from "react";
import {type CQDefinition} from "../model/CQDefinitions.ts";
import QuestionTypeSelector from "./QuestionTypeSelector.tsx";
import type {Ontology} from "../../ontology/Ontology.ts";
import ClassSelector from "./ClassSelector.tsx";
import "./css/CompetencyQuestions.css";
import PredicatesSelector from "./PredicateSelector.tsx";
import {CQExecutor} from "../model/CQExecutor.ts";
import type {CQValues} from "../model/CQValues.ts";
import type {CQResult} from "../model/CQResult.ts";

type Props = {
    ontology: Ontology,
    setCQResult: (cqResult: CQResult | null) => void,
}

export default function CompetencyQuestions({ontology, setCQResult}: Props) {
    const [selectedDefinition, setSelectedDefinition] = useState<CQDefinition | null>(null);
    const [values, setValues] = useState<CQValues>({});
    const isComplete = selectedDefinition?.fields.every(field => {
        if (field.optional) {
            return true;
        }

        return Boolean(values[field.name]);
    }) ?? false;
    
    useEffect(() => {
        if(!isComplete) {
            setCQResult(null);
            return;
        }
        setCQResult(new CQExecutor().executeCQ(selectedDefinition, ontology, values));
    }, [isComplete, ontology, selectedDefinition, setCQResult, values])

    const selectDefinition = (definition: CQDefinition |null) => {
        setSelectedDefinition(definition);
        setValues({});
        setCQResult(null);
    }

    const setFieldValue = (fieldName: string, value: string) => {
        setValues(prevValues => ({...prevValues, [fieldName]: value}));
    }

    return (
        <div className="cq-builder">

            <div className="cq-builder-header">
                <h2>Query Ontology</h2>

                <QuestionTypeSelector selectedDefinition={selectedDefinition}
                                      setSelectedDefinition={selectDefinition}/>

            </div>

            {selectedDefinition && (
                <div className="cq-builder-question">
                    {selectedDefinition.fields.map(field => (
                        <div key={field.name} className="cq-builder-field">

                            {field.type === "class" ?

                                <ClassSelector
                                    ontology={ontology}
                                    label={field.label}
                                    value={values[field.name] ?? null}
                                    onSelect={(value: string) => setFieldValue(field.name, value)}
                                />
                                :
                                <PredicatesSelector
                                    ontology={ontology}
                                    label={field.label}
                                    value={values[field.name] ?? null}
                                    onSelect={(value: string) => setFieldValue(field.name, value)}
                                />
                            }
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
}