export abstract class Role {
    abstract identifier: string;
    abstract body: BodyPartConstant[];

    abstract want(room: Room): number;
    abstract need(room: Room): number;
    abstract max(room: Room): number;

    abstract run(creep: Creep): void;

    creeps(): Creep[] {
        return _.filter(Game.creeps, (creep) => creep.memory.role == this.identifier);
    }
    have(room: Room): number {
        return this.creeps().filter((creep) => creep.memory.room == room.name).length;
    };
}

export function setSourceDivision() {
    Memory.sources = {};
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        Memory.sources[room.name] = {};

        var sources = room.find(FIND_SOURCES);
        sources.forEach(source => {
            Memory.sources[room.name][source.id] = 0;
        });
    }

    _.forEach(Game.creeps, creep => {
        if (creep.memory.source) {
            Memory.sources[creep.memory.room][creep.memory.source]++;
        }
    });
}

export function bodyCost(bodyParts: BodyPartConstant[]): number {
    return _.sum(bodyParts, part => BODYPART_COST[part]);
}
