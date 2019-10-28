import { Harvester } from "role.harvester";
import { Role } from "role";

export class Builder extends Harvester {
    identifier: string = "builder";

    want(room: Room) {
        return (room.controller!.level - 1) * 6;
    }

    need(room: Room) {
        return 0;
    }

    max(room: Room) {
        return 4;
    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.prepareRun(creep);

        var room = Game.rooms[creep.memory.room];
        var targetSource = room.find(FIND_SOURCES).filter(source => source.id == creep.memory.source)[0];

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.tempRole = undefined;
            creep.say('🚜');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                var spawn = room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN } })[0];
                if (!creep.pos.inRangeTo(spawn, 5))
                    creep.moveTo(spawn);
                else
                    creep.memory.tempRole = "upgrader"
            }
        }
        else {
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};
