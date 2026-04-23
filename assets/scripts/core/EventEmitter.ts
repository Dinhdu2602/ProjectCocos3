type Callback = (data?: any) => void;
type Listener = {
    callback: Callback;
    target?: any;
};

class EventEmitter {
    private events: Map<string, Listener[]> = new Map();
    
    on(event: string, callback: Callback, target?: any) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        console.log("EventEmitter loaded");
        this.events.get(event)!.push({ callback, target });
    }

    off(event: string, callback: Callback, target?: any) {
        if (!this.events.has(event)) return;

        const listeners = this.events.get(event)!;

        this.events.set(
            event,
            listeners.filter(
                l => l.callback !== callback || l.target !== target
            )
        );
    }

    emit(event: string, data?: any) {
        if (!this.events.has(event)) return;

        this.events.get(event)!.forEach(listener => {
            listener.callback.call(listener.target, data);
        });
    }
}

export default new EventEmitter();