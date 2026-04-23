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

        const listeners = this.events.get(event)!;

        
        const exists = listeners.some(
            l => l.callback === callback && l.target === target
        );

        if (exists) return;

        listeners.push({ callback, target });
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

    const listeners = this.events.get(event)!;

    this.events.set(
        event,
        listeners.filter((l, index) => {
            try {
                if (l.target && !l.target.isValid) {
                    console.warn("remove dead listener", event, index);
                    return false;
                }

                l.callback.call(l.target, data);
                return true;
            } catch (e) {
                console.error("crash listener:", event, index, l);
                return false;
            }
        })
    );
}

    clear() {
        this.events.clear();
    }
}

export const eventEmitter = new EventEmitter();