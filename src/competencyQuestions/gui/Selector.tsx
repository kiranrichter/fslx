import {useCallback, useEffect, useRef, useState} from "react";
import {useDropdownDismiss} from "../../hooks/useDropdownDismiss.ts";
import "./css/Selector.css";

type Props = {
    label: string,
    headerText: string,
    footerText: string,
    content: Content[],
    onClickEvent: (content: Content) => void,
    searchable?: boolean,
}

type Content = {
    value: string,
    label: string,
    toolTip: string,
}

export default function Selector({label, headerText, footerText, content, onClickEvent, searchable}: Props) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const visibleContent = searchable ? content.filter(c => c.label.toLowerCase().includes(searchTerm.toLowerCase())) : content;

    const close = useCallback(() => setOpen(false), []);
    useDropdownDismiss(dropdownRef, close);

    useEffect(() => {
        if (open) {
            searchRef.current?.focus();
        }
    }, [open]);

    const handleClick = (c: Content) => {
        onClickEvent(c);
        setOpen(false);
    }

    return (
        <div className="selector" ref={dropdownRef}>

            <button
                type="button"
                className="selector-button"
                aria-expanded={open}
                onClick={() => setOpen(prev => !prev)}
            >
                <span>
                    {label}
                </span>

                <span className={`selector-arrow ${open ? "open" : ""}`}>
                    ▾
                </span>
            </button>

            {open && (
                <div className="selector-dropdown">

                    {(headerText || searchable) &&
                        <div className="selector-header">
                            {searchable &&
                                <input ref={searchRef} className="selector-search" type="text" value={searchTerm}
                                       placeholder="Search..." onChange={e => setSearchTerm(e.target.value)}/>
                            }
                            {headerText &&
                                <span className="selector-header-text">{headerText}</span>
                            }
                        </div>
                    }

                    <div className="selector-list">
                        {visibleContent
                            .map(c => (
                                <button
                                    type="button"
                                    key={c.value}
                                    className="selector-option"
                                    onClick={() => handleClick(c)}
                                    title={c.toolTip}
                                >
                                    <span>{c.label}</span>
                                </button>
                            ))}
                    </div>

                    {footerText &&
                        <div className="selector-footer">{footerText}</div>
                    }
                </div>
            )}

        </div>
    );
}