import { Harvester } from "role.harvester";

export class Upgrader extends Harvester {

    identifier: string = "upgrader";
    body: BodyPartConstant[] = [WORK, MOVE, CARRY];

    want(room: Room) {
        return 11 - room.controller!.level;
    }

    need(room: Room) {
        return 2;
    }

    max(room: Room) {
        return 10;
    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.prepareRun(creep);

        var room = Game.rooms[creep.memory.room];
        var targetSource = room.find(FIND_SOURCES).filter(source => source.id == creep.memory.source)[0];

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && (creep.carryCapacity - creep.carry.energy) == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
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
