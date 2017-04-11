export interface ISessionService {
    session: any;
    isOpened(): boolean;

    open(session: any): void;
    close(): void;
}

export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}
