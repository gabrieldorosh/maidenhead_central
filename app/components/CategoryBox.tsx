'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import queryString from "query-string";

interface CategoryBoxProps {
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected = false,
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        let currentQuery = {};

        // Check if we have params and parse them
        if (params) {
            currentQuery = queryString.parse(params.toString());
        }

        // Add new category to query
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        // Reset category if already selected
        if (params?.get('category') === label) {
            delete updatedQuery.category;
        }

        // Generate and push new URL
        const url = queryString.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true });

        router.push(url);
    }, [label, params, router]);

    return (
        <div
            onClick={handleClick}
            className={`
                flex
                flex-col
                items-center
                justify-center
                gap-2
                p-3
                border-b-2
                hover:text-neutral-800
                transition
                cursor-pointer
                ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                ${selected ? 'text-neutral-800' : 'text-neutral-500'}
            `}
        >
            <Icon size={26} />
            <div className="font-medium text-sm text-center whitespace-nowrap">
                {label}
            </div>
        </div>
    )
}

export default CategoryBox;