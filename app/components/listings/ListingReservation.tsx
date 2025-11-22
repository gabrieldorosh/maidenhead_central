'use client';

import { Range } from 'react-date-range';
import Calendar from '../inputs/Calendar';
import Button from '../Button';
import { differenceInCalendarDays } from 'date-fns';

interface ListingReservationProps {
    price: number;
    dateRange: Range;
    totalPrice: number;
    onChangeDate: (value: Range) => void;
    onSubmit: () => void;
    disabled?: boolean;
    disabledDates: Date[];
    minStay?: number;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
    price,
    dateRange,
    totalPrice,
    onChangeDate,
    onSubmit,
    disabled,
    disabledDates,
    minStay = 2, // default minimum stay
}) => {
    const selectedNights = dateRange.startDate && dateRange.endDate 
        ? differenceInCalendarDays(dateRange.endDate, dateRange.startDate)
        : 0;

    const meetsMinStay = selectedNights >= minStay;
    const hasSelectedDates = dateRange.startDate && dateRange.endDate && selectedNights > 0;
    const hasValidSelection = hasSelectedDates && meetsMinStay;
    return (
        <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">   
            <div className='flex flex-row items-center gap-1 p-4'>
                <div className='text-2xl font-semibold'>
                    £ {price}
                </div>
                <div className='font-light text-neutral-600'>
                    / night
                </div>
            </div>
            <hr />
            <Calendar
                value={dateRange}
                disabledDates={disabledDates}
                onChange={(value) => onChangeDate(value.selection)}
            />
            <hr />

            <div className="h-16 flex items-center justify-center">
                {/* Date selection validation */}
                {(dateRange.startDate && dateRange.endDate && selectedNights === 0) && (
                    <div className="px-4 text-center">
                        <p className="text-xs text-gray-500">
                            Please select a check-out date to see the total price
                        </p>
                    </div>
                )}
                
                {/* Minimum stay validation */}
                {hasSelectedDates && !meetsMinStay && (
                    <div className="px-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            Minimum <span className='font-bold'>{minStay} {minStay === 1 ? 'night' : 'nights'}</span> required
                        </p>
                        <p className="text-xs text-gray-400">
                            Email host with your requested dates for shorter stays
                        </p>
                    </div>
                )}

                {/* Total price */}
                {hasSelectedDates && hasValidSelection && (
                    <div className='px-4 w-full flex flex-row items-center justify-between font-semibold text-lg'>
                        <div>
                            Total
                        </div>
                        <div>
                            £ {totalPrice}
                        </div>
                    </div>
                )}
            </div>
            
            <div className='px-4 pb-4'>
                <Button
                    disabled={disabled || !hasSelectedDates}
                    label={hasSelectedDates && !meetsMinStay ? 'Contact Host for Booking' : 'Reserve'}
                    onClick={onSubmit}
                />
            </div>
        </div>
    )
}

export default ListingReservation;