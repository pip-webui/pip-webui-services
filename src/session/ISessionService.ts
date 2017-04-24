export interface ISessionService {
    session: any;
    isOpened(): boolean;

    addOpenListener(listener: any): void;
    addCloseListener(listener: any): void;
    removeOpenListener(listener: any): void;
    removeCloseListener(listener: any): void;
    clearOpenListeners(): void;
    clearCloseListeners(): void;
    
    open(session: any, decorator?: (callback: () => void) => void): void;
    close(): void;
}

export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}
