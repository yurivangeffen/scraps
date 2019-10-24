import { Harvester } from "role.harvester";

export class Builder extends Harvester {

    identifier: string = "builder";
    body: BodyPartConstant[] = [WORK, MOVE, CARRY];

    want(room: Room) {
        return (room.controller!.level - 1) * 2;
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
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
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
                    creep.say("💤 idle");
            }
        }
        else {
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};
