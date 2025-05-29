import React from 'react';

interface SaveStatusProps {
    status: 'idle' | 'saving' | 'saved';
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ status }) => {
    if (status === 'idle') return null;

    return (
        <div className="flex items-center gap-2">
            {status === 'saving' && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    Saving...
                </span>
            )}
            {status === 'saved' && (
                <span className="text-sm text-green-500 dark:text-green-400">
                    Saved
                </span>
            )}
        </div>
    );
}; 