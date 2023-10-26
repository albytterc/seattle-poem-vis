import { createContext } from 'react';

interface PageContextTypes {
    numPages: number;
    pageIndex: number;
    setPageIndex: (idx: number) => void;
}

export const PageContext = createContext<PageContextTypes>({
    numPages: 6,
    pageIndex: 0,
    setPageIndex: () => {}
});