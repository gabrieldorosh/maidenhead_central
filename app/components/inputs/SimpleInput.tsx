'use client';

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiPound, BiChevronDown } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";

interface SimpleInputProps {
    id: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    placeholder?: string;

    // dropdown props
    isDropdown?: boolean;
    options?: Array<{ value: string; label: string }>;
    value?: string;
    onChange?: (value: string) => void;
}

const SimpleInput: React.FC<SimpleInputProps> = ({
    id,
    type = "text",
    disabled,
    formatPrice,
    required,
    register,
    errors,
    placeholder,
    isDropdown = false,
    options = [],
    value,
    onChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // make sure highlighted option is visible
    useEffect(() => {
        if (highlightedIndex >= 0 && optionsRef.current) {
            const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [highlightedIndex]);

    // filter by search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // reset the highlighted index when options change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filteredOptions.length]);


    // handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
                    onChange?.(filteredOptions[highlightedIndex].value);
                    setIsOpen(false);
                    setSearchTerm('');
                    setHighlightedIndex(-1);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
                break;
        }
    };

    if (isDropdown) {
        return (
            <div className="w-full relative" ref={dropdownRef}>
                <div
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(!isOpen);
                            setSearchTerm('');
                            setHighlightedIndex(-1);
                            if (!isOpen) {
                                // Focus the input when opening
                                setTimeout(() => inputRef.current?.focus(), 100);
                            }
                        }
                    }}
                    className={`
                        w-full
                        px-3
                        py-2
                        text-sm
                        border
                        rounded-md
                        outline-none
                        transition
                        cursor-pointer
                        flex
                        items-center
                        justify-between
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        disabled:bg-gray-50
                        ${errors[id] ? 'border-rose-500' : 'border-gray-300'}    
                        ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}    
                        ${isOpen ? 'border-black' : ''}
                    `}
                >
                    {isOpen ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type to search..."
                            className="flex-1 bg-transparent outline-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={value ? 'text-black' : 'text-gray-500'}>
                            {value ? options.find(opt => opt.value === value)?.label : placeholder}
                        </span>
                    )}
                    <BiChevronDown 
                        size={16} 
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
                
                {isOpen && (
                    <div 
                        ref={optionsRef}
                        className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange?.(option.value);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                        setHighlightedIndex(-1);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`px-3 py-2 text-sm cursor-pointer ${
                                        index === highlightedIndex 
                                            ? 'bg-blue-100 text-blue-900' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                {searchTerm ? `No results found for "${searchTerm}"` : 'No options available'}
                            </div>
                        )}
                    </div>
                )}
                
                {/* hidden input for form registration */}
                <input
                    {...register(id, { required })}
                    type="hidden"
                    value={value || ''}
                />
            </div>
        );
    }

    return (
        <div className="w-full relative">
            {formatPrice && (
                <BiPound 
                    size={20}
                    className="
                        text-neutral-700
                        absolute
                        top-1/2
                        transform
                        -translate-y-1/2
                        left-3
                        z-10
                    "
                />
            )}
            <input 
                id={id}
                disabled={disabled}
                {...register(id, { required })}
                placeholder={placeholder}
                type={type}
                min={type === "number" ? "1" : undefined}
                step={type === "number" ? "1" : undefined}
                className={`
                    w-full
                    px-3
                    py-2
                    text-sm
                    border
                    rounded-md
                    outline-none
                    transition
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    disabled:bg-gray-50
                    ${formatPrice ? 'pl-8' : 'px-3'}    
                    ${errors[id] ? 'border-rose-500' : 'border-gray-300'}    
                    ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}    
                `}
            />
        </div>
    );
};

export default SimpleInput;
