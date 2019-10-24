import { Role } from "./role"

interface SourceWorkers {
    [source: string]: number
}

export class Harvester extends Role {

    identifier: string = "harvester";
    body: BodyPartConstant[] = [WORK, MOVE, CARRY];

    want(room: Room) {
        return room.controller!.level * 2;
    }

    need(room: Room) {
        return 1;
    }

    max(room: Room) {
        return 16;
    }

    /** @param {Creep} creep **/
    run(creep: Creep) {
        this.prepareRun(creep);

        var room = Game.rooms[creep.memory.room];
        var targetSource = room.find(FIND_SOURCES).filter(source => source.id == creep.memory.source)[0];

        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.energyCapacity - structure.energy > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
    }

    protected prepareRun(creep: Creep) {
        if (creep.memory.room == "")
            creep.memory.room = creep.room.name;
        if (creep.memory.source == null)
            this.assignSource(creep);
    }

    private assignSource(creep: Creep) {
        var room = creep.memory.room;
        var roomSources = Memory.sources[room];
        var lowestName: string = "";
        var lowestValue: number = Number.MAX_VALUE;

        for (var id in roomSources) {
            if (roomSources[id] < lowestValue) {
                lowestName = id;
                lowestValue = roomSources[id]
            }
        }

        if (lowestName != "") {
            creep.memory.source = lowestName;
            Memory.sources[room][lowestName]++;
        }

    }
};
