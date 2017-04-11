export interface ITimerService {
    isStarted(): boolean;

    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;

    start(): void;
    stop(): void;
}
