import { ErrorMapper } from "utils/ErrorMapper";
import { Role, bodyCost, setSourceDivision } from "./role";
import { Harvester } from "./role.harvester";
import { Upgrader } from "role.upgrader";
import { Builder } from "role.builder";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  setSourceDivision();

  var roles = [
    new Harvester(),
    new Upgrader(),
    new Builder()
  ]

  const spawn = Game.spawns["ROOT"];
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

  var toSwitch: Role[] = [];
  toSpawn.forEach(role => {
    if (spawn.energy >= bodyCost(role.body))
      spawn.spawnCreep(role.body, role.identifier + Game.time, { memory: { role: role.identifier, room: spawn.room.name } })
    else
      toSwitch[toSwitch.length] = role;
  });

  //TODO: see if we can switch roles

  roles.forEach(role => {
    role.creeps().forEach(creep => {
      role.run(creep);
    })
  });

  /*var spawningCreepName = Game.spawns['ROOT']!.spawning!.name;
  if (spawningCreepName) {
    var spawningCreep = Game.creeps[spawningCreepName];
    if (spawningCreep)
      Game.spawns['ROOT'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['ROOT'].pos.x + 1,
        Game.spawns['ROOT'].pos.y,
        { align: 'left', opacity: 0.8 });
  }*/

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
