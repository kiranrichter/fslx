import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDropdownDismiss} from "../hooks/useDropdownDismiss.ts";
import "./css/PredicatesPicker.css";

type Props = {
    setPredicates: (predicates: string[]) => void,
    allPredicates: string[],
};

const storageKey = "predicates";

const defaultPredicates = [
    "subClassOf",
    "elementOf",
    "type",
]

const readStoredPredicates = (): string[] => {
    try {
        const storedPredicates = window.localStorage.getItem(storageKey);

        if (!storedPredicates) {
            return defaultPredicates;
        }

        const parsed: unknown = JSON.parse(storedPredicates);

        if (!Array.isArray(parsed) || parsed.some(value => typeof value !== "string")) {
            return defaultPredicates;
        }

        return parsed as string[];
    } catch {
        return defaultPredicates;
    }
}

export default function PredicatesPicker({setPredicates, allPredicates}: Props) {
    const [selectedPredicates, setSelectedPredicates] = useState<string[]>(readStoredPredicates);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setOpen(false), []);
    useDropdownDismiss(dropdownRef, close);

    const allSelected = allPredicates.length > 0
        && allPredicates.every(predicate => selectedPredicates.includes(predicate));

    const sortedPredicates = useMemo(
        () => [...allPredicates].sort((a, b) =>
            Number(selectedPredicates.includes(b)) - Number(selectedPredicates.includes(a))
        ),
        [allPredicates, selectedPredicates]
    );

    useEffect(() => {
        setPredicates(selectedPredicates);
        window.localStorage.setItem(storageKey, JSON.stringify(selectedPredicates));
    }, [selectedPredicates, setPredicates]);

    const togglePredicate = (predicate: string) => {
        setSelectedPredicates(prev =>
            prev.includes(predicate)
                ? prev.filter(value => value !== predicate)
                : [...prev, predicate]
        );
    };

    const toggleAll = () => {
        setSelectedPredicates(allSelected ? [] : [...allPredicates]);
    };

    return (
        <div className="predicates-picker" ref={dropdownRef}>

            <button
                type="button"
                className="predicates-picker-button"
                aria-expanded={open}
                onClick={() => setOpen(prev => !prev)}
            >
                <span>
                    Predicates
                    {selectedPredicates.length > 0 &&
                        ` (${selectedPredicates.length})`
                    }
                </span>

                <span className={`predicates-picker-arrow ${open ? "open" : ""}`}>
                    ▾
                </span>
            </button>

            {open && (
                <div className="predicates-picker-dropdown">

                    <div className="predicates-picker-header">
                        <span className="predicates-picker-header-text">Preview Predicates</span>
                        <label className="predicate-option">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                            />
                            <span>Select All</span>
                        </label>
                    </div>

                    <div className="predicates-picker-list">
                        {sortedPredicates.map(predicate => (
                            <label
                                key={predicate}
                                className="predicate-option"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPredicates.includes(predicate)}
                                    onChange={() => togglePredicate(predicate)}
                                />

                                <span>{predicate}</span>
                            </label>
                        ))}
                    </div>

                    <div className="predicates-picker-footer">Selected {selectedPredicates.length} out
                        of {allPredicates.length}</div>

                </div>
            )}
        </div>
    );
}
