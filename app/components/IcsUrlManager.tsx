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
    const [isForceResyncing, setIsForceResyncing] = useState(false);
    const [showForceResyncConfirm, setShowForceResyncConfirm] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

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

    const handleForceResyncConfirm = () => {
        setShowForceResyncConfirm(false);
        handleSync(true);
    };

    const handleSync = async (forceResync = false) => {
        if (!icsUrl.trim()) {
            toast.error('Please set an ICS URL first');
            return;
        }

        if (forceResync) {
            setIsForceResyncing(true);
        } else {
            setIsSyncing(true);
        }
        
        try {
            const response = await axios.post('/api/calendar/sync', {
                listingId,
                icsUrl: icsUrl.trim(),
                forceResync
            });
            
            const result = response.data.result;
            if (forceResync) {
                toast.success(`Force resync completed: ${result.deleted} cleared, ${result.created} imported`);
            } else {
                toast.success('Calendar synced successfully');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to sync calendar');
        } finally {
            if (forceResync) {
                setIsForceResyncing(false);
            } else {
                setIsSyncing(false);
            }
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
                    onClick={() => handleSync(false)}
                    disabled={isSyncing || isForceResyncing || !icsUrl.trim() || !isValidUrl}
                    outline
                />
                {showAdvancedOptions && (
                    <Button
                        label={isForceResyncing ? "Force Resyncing..." : "Force Resync"}
                        onClick={() => setShowForceResyncConfirm(true)}
                        disabled={isSyncing || isForceResyncing || !icsUrl.trim() || !isValidUrl}
                        outline
                    />
                )}
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 space-y-1 flex-1">
                    <p><span className="font-medium">Sync Now:</span> Updates calendar reservations incrementally</p>
                    {showAdvancedOptions && (
                        <p><span className="font-medium text-red-600">Force Resync:</span> Deletes all calendar reservations and reimports from scratch (use for troubleshooting)</p>
                    )}
                </div>
                <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-4 flex items-center gap-1"
                >
                    {showAdvancedOptions ? (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Hide Advanced
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Advanced Options
                        </>
                    )}
                </button>
            </div>

            {/* Force Resync Confirmation Dialog */}
            {showForceResyncConfirm && showAdvancedOptions && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-800">
                                Are you sure you want to force resync?
                            </h4>
                            <div className="mt-2 text-sm text-red-700">
                                <p>This will permanently delete all existing calendar-synced reservations and reimport them from scratch.</p>
                                <p className="mt-1 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button
                            label="Cancel"
                            onClick={() => setShowForceResyncConfirm(false)}
                            outline
                            small
                        />
                        <Button
                            label="Yes, Force Resync"
                            onClick={handleForceResyncConfirm}
                            small
                        />
                    </div>
                </div>
            )}

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
