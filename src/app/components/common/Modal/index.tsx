'use client';
import React from 'react';
import { Dialog, DialogContent } from '../../shadcn/dialog';

interface TimeSlotDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<TimeSlotDialogProps> = ({
    isOpen,
    setIsOpen,
    children,
    className,
}) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={className}>{children}</DialogContent>
    </Dialog>
);
