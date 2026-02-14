import * as React from 'react';
import { IconBaseProps } from 'react-icons/lib';

declare module 'react-icons/lib' {
    interface IconBaseProps extends React.SVGAttributes<SVGElement> {
        children?: React.ReactNode;
        className?: string; // Explicitly add className
    }
}
