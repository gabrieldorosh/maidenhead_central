'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Button from './Button';

interface IcsUrlManagerProps {
    listingId: string;
    currentIcsUrl?: string;
    onUpdate?: (newUrl: string | null) => void;
}

const IcsUrlManager: React.FC<IcsUrlManagerProps> = ({
    listingId,
    currentIcsUrl = '',
    onUpdate
}) => {
    const [icsUrl, setIcsUrl] = useState(currentIcsUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        
        try {
            const response = await axios.patch(`/api/listings/${listingId}/ics`, {
                icsUrl: icsUrl.trim() || null
            });
            
            toast.success('ICS URL updated successfully');
            onUpdate?.(icsUrl.trim() || null);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update ICS URL');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        if (!icsUrl.trim()) {
            toast.error('Please set an ICS URL first');
            return;
        }

        setIsSyncing(true);
        
        try {
            const response = await axios.post('/api/calendar/sync', {
                listingId,
                icsUrl: icsUrl.trim()
            });
            
            toast.success('Calendar synced successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to sync calendar');
        } finally {
            setIsSyncing(false);
        }
    };

    const validateUrl = (url: string) => {
        if (!url) return true;
        try {
            new URL(url);
            return url.includes('.ics') || url.includes('calendar');
        } catch {
            return false;
        }
    };

    const isValidUrl = validateUrl(icsUrl);

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <div>
                <h3 className="text-lg font-semibold mb-2">Calendar Sync Settings</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Connect your external calendar (Airbnb, Booking.com, etc.) to automatically sync reservations.
                </p>
            </div>

            <div>
                <label htmlFor="icsUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    ICS Calendar URL
                </label>
                <input
                    id="icsUrl"
                    type="url"
                    value={icsUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIcsUrl(e.target.value)}
                    placeholder="https://example.com/calendar.ics"
                    disabled={isLoading}
                    className="
                        w-full
                        p-3
                        border-2
                        rounded-md
                        outline-none
                        transition
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        border-neutral-300
                        focus:border-black
                    "
                />
                {icsUrl && !isValidUrl && (
                    <p className="text-red-500 text-sm mt-1">
                        Please enter a valid calendar URL containing '.ics' or 'calendar'
                    </p>
                )}
            </div>

            <div className="flex gap-3">
                <Button
                    label="Save URL"
                    onClick={handleSave}
                    disabled={isLoading || !isValidUrl}
                />
                <Button
                    label={isSyncing ? "Syncing..." : "Sync Now"}
                    onClick={handleSync}
                    disabled={isSyncing || !icsUrl.trim() || !isValidUrl}
                    outline
                />
            </div>

            {currentIcsUrl && (
                <div className="text-sm text-gray-500 break-words">
                    <p className="break-all">
                        <span className="font-medium">Current URL:</span>{' '}
                        <span className="text-gray-400">{currentIcsUrl}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default IcsUrlManager;
