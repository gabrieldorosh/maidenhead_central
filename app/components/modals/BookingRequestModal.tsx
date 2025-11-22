'use client';

import { useState, useCallback } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';

import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Counter from '../inputs/Counter';
import { Range } from 'react-date-range';
import { differenceInCalendarDays } from 'date-fns';

interface BookingRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: {
        id: string;
        title: string;
        price: number;
        guestCount: number;
        minStay?: number;
    };
    dateRange: Range;
    totalPrice: number;
}

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
    isOpen,
    onClose,
    listing,
    dateRange,
    totalPrice
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [guestCount, setGuestCount] = useState(2);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (!dateRange.startDate || !dateRange.endDate) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('/api/booking-request', {
                listingId: listing.id,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                totalPrice,
                guestInfo: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    guestCount: guestCount.toString()
                },
                message: data.message || undefined
            });

            toast.success('Booking request sent successfully!');
            reset();
            onClose();
        } catch (error: any) {
            console.error('Booking request error:', error);
            toast.error(error.response?.data?.error || 'Failed to send booking request');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = useCallback(() => {
        if (!isLoading) {
            reset();
            onClose();
        }
    }, [isLoading, reset, onClose]);

    // Format dates for better readability
    const checkInDate = dateRange.startDate ? format(dateRange.startDate, 'MMM dd, yyyy') : '';
    const checkOutDate = dateRange.endDate ? format(dateRange.endDate, 'MMM dd, yyyy') : '';
    const nights = dateRange.startDate && dateRange.endDate 
        ? differenceInCalendarDays(dateRange.endDate, dateRange.startDate)
        : 0;

    // Check min stay requirements
    const minStay = listing.minStay || 2;
    const meetsMinStay = nights >= minStay;
    const hasValidSelection = nights > 0 && meetsMinStay;

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading
                title="Request to book"
                subtitle={`Send a booking request for ${listing.title}`}
            />
            
            {/* Guest Count */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-3">Number of Guests</h3>
                <Counter
                    title="Guests"
                    subtitle="How many guests will be staying?"
                    value={guestCount}
                    onChange={setGuestCount}
                />
            </div>
            
            {/* Booking Summary */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{checkInDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nights:</span>
                        <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-medium">{guestCount} {guestCount === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-300">
                        {hasValidSelection ? (
                            <div className="flex justify-between">
                                <span className="font-semibold">Total:</span>
                                <span className="font-semibold text-lg">£{totalPrice}</span>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="font-semibold text-sm mb-1">Special rates apply</div>
                                <div className="text-xs text-orange-600">
                                    Minimum {minStay} {minStay === 1 ? 'night' : 'nights'} required
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Your Information</h3>
                <div className="space-y-4">
                    <Input
                        id="name"
                        label="Full Name"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                    
                    <Input
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Host (Optional)
                </label>
                <textarea
                    {...register('message')}
                    disabled={isLoading}
                    placeholder="Tell the host a bit about yourself and why you're interested in their place..."
                    className="
                        w-full
                        p-3
                        border
                        border-neutral-300
                        rounded-md
                        outline-none
                        transition
                        focus:border-black
                        resize-none
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                    "
                    rows={4}
                />
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={isOpen}
            title="Booking Request"
            actionLabel="Send Request"
            onClose={handleClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
        />
    );
};

export default BookingRequestModal;
