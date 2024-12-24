'use client';

import Container from "../Container";
import { MdOutlineTrain, MdOutlineVilla } from "react-icons/md";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { TbAccessible, TbAirBalloon, TbBabyCarriage, TbBath, TbBed, TbCalendarPlus, TbCar, TbDiamond, TbDisabled, TbMap2, TbMapPin, TbMountain, TbPool, TbShirt, TbTag, TbUsersGroup, TbWalk } from "react-icons/tb";
import { LuCctv, LuExpand, LuTreeDeciduous } from "react-icons/lu";

export const categories = [
    {
        label: 'Town Centre',
        icon: TbMapPin,
        description: 'Stay in the heart of it all.'
    },
    {
        label: 'Pools',
        icon: TbPool,
        description: 'Take a dip in the pool.'
    },
    {
        label: 'Lux',
        icon: TbDiamond,
        description: 'High-end luxury.'
    },
    {
        label: 'Attractions',
        icon: TbAirBalloon,
        description: 'Close to local highlights.'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'This property is modern.'
    },
    {
        label: 'Family Friendly',
        icon: TbBabyCarriage,
        description: 'Great for kids and families.'
    },
    {
        label: 'Discounted',
        icon: TbTag,
        description: 'Discounted rates available.'
    },
    {
        label: 'Accessible',
        icon: TbAccessible,
        description: 'Designed for all guests.'
    },
    {
        label: 'Countryside',
        icon: TbMountain,
        description: 'Enjoy the great outdoors.'
    },
    {
        label: 'Garden',
        icon: LuTreeDeciduous,
        description: 'Enjoy private outdoor greenery.'
    },
    {
        label: 'Open-Plan',
        icon: LuExpand,
        description: 'Spacious, airy open layout.'
    },
    {
        label: 'Large Groups',
        icon: TbUsersGroup,
        description: 'Roomy spaces for everyone.'
    },
    {
        label: 'Walkable',
        icon: TbWalk,
        description: 'Easily explore on foot.'
    },
    {
        label: 'En-Suite',
        icon: TbBath,
        description: 'Private bathroom convenience.'
    },
    {
        label: 'Extended Stay',
        icon: TbCalendarPlus,
        description: 'Perfect for longer visits.'
    },
    {
        label: 'Private Driveway',
        icon: TbCar,
        description: 'Your own secure driveway.'
    },
    {
        label: 'Laundry',
        icon: TbShirt,
        description: 'In-house laundry facilities.'
    },
    {
        label: 'Ramped',
        icon: TbDisabled,
        description: 'Smooth entry for all abilities.'
    },
    {
        label: 'Ground Beds',
        icon: TbBed,
        description: 'Convenient access.'
    },
    {
        label: 'London Links',
        icon: MdOutlineTrain,
        description: 'Direct train to the city.'
    },
    {
        label: 'CCTV',
        icon: LuCctv,
        description: 'Security cameras for peace of mind.'
    },
    {
        label: 'Outskirts',
        icon: TbMap2,
        description: 'Escape the hustle and bustle.'
    },
]

const Categories = () => {
    const params = useSearchParams();

    // Extract active category from URL
    const category = params?.get('category');

    // Only show on homepage
    const pathname = usePathname();
    const isMainPage = pathname === '/';

    if (!isMainPage) {
        return null
    };

    return (
        <Container>
            <div
                className="
                    pt-4
                    flex
                    flex-row
                    items-center
                    justify-between
                    overflow-x-auto
                "
            >
                {categories.map((item) => 
                    <CategoryBox 
                        key={item.label}
                        label={item.label}
                        selected={category === item.label}
                        icon={item.icon}
                    />
                )}    
            </div>
        </Container>
    );
}

export default Categories;