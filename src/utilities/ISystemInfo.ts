export interface ISystemInfo {
    browserName: string;
    browserVersion: string;
    platform: string;
    os: string;

    isDesktop(): boolean;
    isMobile(): boolean;
    isCordova(): boolean;
    isSupported(supported?: any): boolean;
}