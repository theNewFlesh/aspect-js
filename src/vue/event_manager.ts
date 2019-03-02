import { EventBus } from "./event_bus";
// -----------------------------------------------------------------------------

export interface ISubEvent {
    name: string;
    value: any;
}

export interface IEvent {
    name: string;
    value: any;
    row: object;
    column: string;
}

interface IPacket {
    name: string;
    context: string;
    class: string;
    component: string;
    action: string;
    value: any;
}

export class EventManager {
    constructor(config: object) {
        this.config = config;
    }

    public config: object;

    public _event_to_packet(event: ISubEvent): IPacket {
        const fields: string[] = event.name.split("-");
        const output: IPacket = {
            name: event.name,
            context: fields[0],
            class: fields[1],
            component: fields[2],
            action: fields[3],
            value: event.value,
        };
        return output;
    }

    public _lookup_handler(packet: IPacket): string {
        let key: string = [
            "on",
            packet.context,
            packet.class,
            packet.component,
            packet.action
        ].join("_");
        key = this.config[key];
        return this[key];
    }

    public on_event(event: ISubEvent): void {
        const packet: IPacket = this._event_to_packet(event);
        const handler: any = this._lookup_handler(packet);
        handler(packet);
    }

    public on_node_pane_cell_inport_update(packet: IPacket): void {
        console.log(packet);
    }
}
