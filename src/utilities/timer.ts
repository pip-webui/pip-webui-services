/// <reference path="../../typings/tsd.d.ts" />

module pip.utilities {
    'use strict';

    export interface ITimerService {
        isStarted: boolean;

        addEvent(event: string, timeout: number): void;
        removeEvent(event: string): void;
        clearEvents(): void;

        start(): void;
        stop(): void;
    }

    class TimerEvent {
        event: string;
        timeout: number;
        interval: any;
    }

    let DefaultEvents: TimerEvent[] = [
        <TimerEvent> { event: 'pipAutoPullChanges', timeout: 60000 }, // 1 min
        <TimerEvent> { event: 'pipAutoUpdatePage', timeout: 15000 }, // 15 sec
        <TimerEvent> { event: 'pipAutoUpdateCollection', timeout: 300000 } // 5 min
    ]

    class TimerService {
        private _rootScope: ng.IRootScopeService;
        private _interval: ng.IIntervalService;        
        private _started = false;
        private _events: TimerEvent[] = _.cloneDeep(DefaultEvents);

        public constructor($rootScope, $interval) {
            this._rootScope = $rootScope;
            this._interval = $interval;
        }

        public get isStarted() {
            return this._started;
        }

        public addEvent(event: string, timeout: number): void {
            var existingEvent = _.find(this._events, (e) => e.event == event);
            if (existingEvent != null) return;

            let newEvent = <TimerEvent> {
                event: event,
                timeout: timeout
            };
            this._events.push(newEvent);

            if (this._started)
                this.startEvent(newEvent);
        }

        public removeEvent(event: string): void {
            for (let i = this._events.length - 1; i >= 0; i--) {
                let existingEvent = this._events[i];
                if (existingEvent.event == event) {
                    this.stopEvent(existingEvent);
                    this._events.splice(i, 1);
                }
            }
        }

        public clearEvents(): void {
            this.stop();
            this._events = [];
        }

        private startEvent(event: TimerEvent): void {
            event.interval = this._interval(
                () => { this._rootScope.$broadcast(event.event) },
                event.timeout
            )
        }

        private stopEvent(event: TimerEvent): void {
            if (event.interval != null) {
                try {
                    this._interval.cancel(event.interval);
                } catch (ex) {
                    // Do nothing
                }
                event.interval = null;
            }
        }

        public start(): void {
            if (this._started) return;

            _.each(this._events, (event) => {
                this.startEvent(event);
            });

            this._started = true;
        }

        public stop(): void {
            _.each(this._events, (event) => {
                this.stopEvent(event);
            });

            this._started = false;
        }
    }

    angular
        .module('pipTimer', [])
        .service('pipTimer', TimerService);

}
