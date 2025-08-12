'use client';
import { OverlayProvider } from 'overlay-kit';
import { ReactNode } from 'react';

interface OverlayProviderWrapperProps {
    children: ReactNode;
}

export default function OverlayProviderWrapper({ children }: OverlayProviderWrapperProps) {
    return (
        <OverlayProvider>
            {children}
        </OverlayProvider>
    );
}