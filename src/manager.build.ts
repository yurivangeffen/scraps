import { spawn } from "child_process";

export class BuildManager {
    shouldRun(): boolean {
        return Game.time % 7 == 0;
    }

    run(controller: StructureController, spawn: StructureSpawn): void {
        const room = controller.room;
        var structureType = [
            { type: STRUCTURE_EXTENSION, distance: 2 }
        ]

        var wanted: number[] = structureType.map((type) => {
            return this.constructingBuilding(type.type, room) ? 0 : this.wantedBuilding(type.type, room);
        });

        var have: number[] = structureType.map((type) => {
            return this.haveBuilding(type.type, room);
        });

        var construct: number[] = wanted.map((want, i) => want - have[i]);

        structureType.forEach((type, i) => {
            var dist = type.distance;
            var positions = this.possibleBuildLocations(room, [spawn.pos.x, spawn.pos.y], dist);
            if (construct[i] > 0)
                console.log("Want to construct " + type.type + ": " + construct[i] + "/" + positions.length);
            while (construct[i] > 0) {
                if (positions.length == 0) {
                    dist++;
                    positions = this.possibleBuildLocations(room, [spawn.pos.x, spawn.pos.y], dist);
                }

                var pos = positions.pop();
                if (!(pos == undefined)) {
                    var buildResult: ScreepsReturnCode = room.createConstructionSite(pos.x, pos.y, type.type);
                    if (buildResult == ERR_INVALID_TARGET)
                        console.log("Failing to build " + type.type + " at " + pos.x + "," + pos.y + ": " + "INVALID TARGET");
                    else if (buildResult != OK) {
                        console.log("Failing to build " + type.type + " at " + pos.x + "," + pos.y + ": " + buildResult);
                        construct[i] = 0;
                    }
                    else
                        construct[i] = 0;
                }
            }
        });
        //console.log(this.possibleBuildLocations());
    }

    private wantedBuilding(structure: string, room: Room): number {
        switch (structure) {
            case STRUCTURE_EXTENSION:
                return [0, 0, 5, 10, 20, 30, 40, 50, 60][room.controller!.level];
        }
        return 0;
    }

    private constructingBuilding(structure: string, room: Room): number {
        return room.find(FIND_MY_CONSTRUCTION_SITES).filter((site) => site.structureType == structure).length;
    }

    private haveBuilding(structure: string, room: Room): number {
        return room.find(FIND_MY_STRUCTURES).filter((site) => site.structureType == structure).length;
    }

    private possibleBuildLocations(room: Room, pos: [number, number], distance: number): { x: number, y: number }[] {
        if (distance == 0)
            return [];

        var sites: { x: number, y: number }[] = [];
        for (var x = -distance; x <= distance; x++)
            for (var y = -distance; y <= distance; y++) {
                // Keeps corners free
                if ((Math.abs(x) == distance || Math.abs(y) == distance) && Math.abs(x) != Math.abs(y))
                    sites[sites.length] = { x: pos[0] + x, y: pos[1] + y };
            }
        /*console.log("---------------")
        console.log(sites.length);
        sites = sites.filter((pos) => {
            room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y).length == 0 &&
            room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y).length == 0 &&
                room.lookForAt(LOOK_TERRAIN, pos.x, pos.y)
                    .filter((obj: Terrain) => obj == "wall").length == 0
        })
        console.log(sites.length);*/

        return sites;
    }
}
