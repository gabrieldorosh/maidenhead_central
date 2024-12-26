'use client';

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import queryString from "query-string";
import dynamic from "next/dynamic";

import Modal from "./Modal";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";

import useSearchModal from "@/app/hooks/useSearchModal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";

enum STEPS {
    LOCATION = 0,
    DATE = 1,
    INFO = 2,
}

const SearchModal = () => {
    const router = useRouter();
    const params = useSearchModal();
    const searchModal = useSearchModal();

    const [location, setLocation] = useState<CountrySelectValue>();
    const [step, setStep] = useState(1);
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [bathroomCount, setBathroomCount] = useState(1);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const Map = useMemo(() => dynamic(() => import("../Map"), {
        ssr: false
    }), [location]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== STEPS.INFO) {
            return onNext();
        } 

        let currentQuery = {};

        if (params) {
            currentQuery = queryString.parse(params.toString());
        }
        
        const updatedQuery: any = {
            ...currentQuery,
            locationValue: location?.value,
            guestCount,
            roomCount,
            bathroomCount,
        };

        if (dateRange.startDate) {
            updatedQuery.startDate = formatISO(dateRange.startDate);
        }

        if (dateRange.endDate) {
            updatedQuery.endDate = formatISO(dateRange.endDate);
        }

        const url = queryString.stringifyUrl({
            url: '/',
            query: updatedQuery,
        }, { skipNull: true });

        setStep(STEPS.LOCATION);
        searchModal.onClose();

        router.push(url);
    }, [
        step,
        searchModal,
        location,
        guestCount,
        roomCount,
        bathroomCount,
        dateRange,
        params,
        onNext,
        router,
    ]);

    const actionLabel = useMemo(() => {
        if (step === STEPS.INFO) {
            return 'Search';
        };

        return 'Next';
    }, [step]);
    
    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.LOCATION) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    // BODY CONTENT
    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading 
                title="Where do you want to go?"
                subtitle="Search for the perfect place to stay!"
            />
            <CountrySelect 
                value={location}
                onChange={(value) => setLocation(value as CountrySelectValue)}
            />
            <hr />
            <Map center={location?.latlng} />
        </div>
    );

    if (step === STEPS.DATE) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="When do you plan to stay?"
                    subtitle="Select the dates you want to stay!"
                />
                <Calendar 
                    value={dateRange}
                    onChange={(value) => setDateRange(value.selection)}
                />
            </div>
        )
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading 
                    title="More information"
                    subtitle="Tell us more about your stay!"
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests are you bringing?"
                    value={guestCount}
                    onChange={(guestCount) => setGuestCount(guestCount)}
                />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms are you looking for?"
                    value={roomCount}
                    onChange={(roomCount) => setRoomCount(roomCount)}
                />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you want?"
                    value={bathroomCount}
                    onChange={(bathroomCount) => setBathroomCount(bathroomCount)}
                />
            </div>
        )
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            onClose={searchModal.onClose}
            onSubmit={onSubmit}
            title="Filters"
            actionLabel={actionLabel}
            secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent}
        />
    )
}

export default SearchModal