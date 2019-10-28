import { ErrorMapper } from "utils/ErrorMapper";
import { Role, bodyCost, setSourceDivision } from "./role";
import { Harvester } from "./role.harvester";
import { Upgrader } from "role.upgrader";
import { Builder } from "role.builder";
import { BuildManager } from "manager.build";
import { Name } from "utils/Name"

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  setSourceDivision();

  var roles = [
    new Harvester(),
    new Upgrader(),
    new Builder()
  ]

  const spawn = Game.spawns["Spawn1"];
  const room = spawn.room;

  var toSpawn: Role[] = [];
  roles.forEach(role => {
    if (role.have(room) < role.need(room))
      toSpawn[toSpawn.length] = role;
  });

  roles.forEach(role => {
    if (role.have(room) < role.want(room))
      toSpawn[toSpawn.length] = role;
  });

  console.log("Spawnables: " + toSpawn.length);
  var roleToSpawn = toSpawn[0];
  var maxEnergy = room.energyCapacityAvailable;
  var cost = roleToSpawn.body.map((e, index) => {
    var body = roleToSpawn.body.slice(0, index + 1);
    var c = bodyCost(body);
    return { body: body, cost: c };
  });

  for (var i = cost.length - 1; i >= 2; i--) {
    var possible = cost[i].cost <= maxEnergy;
    if (possible) {
      console.log("Want " + roleToSpawn.identifier + ". Parts: " + cost[i].body.length + ". Cost: " + cost[i].cost + ". Possible: " + possible);
      if (cost[i].cost > room.energyAvailable) {
        console.log("Not enough energy available: " + room.energyAvailable);
        break;
      }
      var canSpawn = spawn.spawnCreep(
        cost[i].body,
        roleToSpawn.identifier + "_" + Name.randomName(),
        { memory: { role: roleToSpawn.identifier, room: spawn.room.name } }
      )
      if (canSpawn != OK)
        console.log("Couldn't spawn: " + canSpawn);
      else
        break;
    }
  }

  var buildManager = new BuildManager();
  if (buildManager.shouldRun())
    buildManager.run(room.controller!, spawn);

  roles.forEach(role => {
    role.creeps().forEach(creep => {
      role.run(creep);
    })
  });

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
