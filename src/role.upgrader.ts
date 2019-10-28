import { Harvester } from "role.harvester";

export class Upgrader extends Harvester {
    identifier: string = "upgrader";

    want(room: Room) {
        return room.controller!.level;
    }

    need(room: Room) {
        return 1;
    }

    max(room: Room) {
        return 10;
    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.prepareRun(creep);
        if (creep.memory.upgrading == null)
            creep.memory.upgrading = false;

        var room = Game.rooms[creep.memory.room];
        var targetSource = room.find(FIND_SOURCES).filter(source => source.id == creep.memory.source)[0];

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.tempRole = undefined;
            creep.say('🚜');
        }
        if (!creep.memory.upgrading && (creep.carryCapacity - creep.carry.energy) == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(room.controller!) == ERR_NOT_IN_RANGE) {
                creep.moveTo(room.controller!, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};
