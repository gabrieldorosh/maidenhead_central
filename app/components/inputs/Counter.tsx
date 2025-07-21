'use client';

import { useCallback, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CounterProps {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void;
    max?: number;
}

const Counter: React.FC<CounterProps> = ({
    title,
    subtitle,
    value,
    onChange,
    max = 99
}) => {
    const [inputValue, setInputValue] = useState(value.toString());

    const onAdd = useCallback(() => {
        if (value >= max) return;
        onChange(value + 1);
        setInputValue((value + 1).toString());
    }, [onChange, value, max]);

    const onSubtract = useCallback(() => {
        if (value === 1) return;
        onChange(value - 1);
        setInputValue((value - 1).toString());
    }, [onChange, value]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        setInputValue(inputVal);
        
        const numValue = parseInt(inputVal);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= max) {
            onChange(numValue);
        }
    }, [onChange, max]);

    const handleInputBlur = useCallback(() => {
        const numValue = parseInt(inputValue);
        if (isNaN(numValue) || numValue < 1) {
            setInputValue("1");
            onChange(1);
        } else if (numValue > max) {
            setInputValue(max.toString());
            onChange(max);
        } else {
            setInputValue(numValue.toString());
            onChange(numValue);
        }
    }, [inputValue, onChange, max]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur();
            e.currentTarget.blur();
        }
    }, [handleInputBlur]);
    return (
        <div
            className="flex flex-row items-center justify-between"
        >
            <div className="flex flex-col">
                <div className="font-medium">
                    {title}
                </div>
                <div className="font-light text-gray-600">
                    {subtitle}
                </div>
            </div>
            <div className="flex flex-row items-center gap-4">
                <div
                    onClick={onSubtract}
                    className={`
                        w-10
                        h-10
                        rounded-full
                        border-[1px]
                        border-neutral-400
                        flex
                        items-center
                        justify-center
                        text-neutral-600
                        transition
                        select-none
                        ${value === 1 ? '' : 'cursor-pointer hover:opacity-80'}
                    `}
                    style={{ opacity: value === 1 ? 0.5 : 1 }}
                >
                    <AiOutlineMinus />
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    className="
                        w-6
                        text-center
                        text-xl
                        font-light
                        text-neutral-600
                        border-none
                        outline-none
                        bg-transparent
                    "
                    maxLength={2}
                />
                <div
                    onClick={onAdd}
                    className={`
                        w-10
                        h-10
                        rounded-full
                        border-[1px]
                        border-neutral-400
                        flex
                        items-center
                        justify-center
                        text-neutral-600
                        transition
                        select-none
                        ${value >= max ? '' : 'cursor-pointer hover:opacity-80'}
                    `}
                    style={{ opacity: value >= max ? 0.5 : 1 }}
                >
                    <AiOutlinePlus />
                </div>
            </div>
        </div>
    );
}

export default Counter;