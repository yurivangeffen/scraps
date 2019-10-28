// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  source?: string;
  building?: boolean;
  upgrading?: boolean;
  transfering?: boolean;
  tempRole?: string;
}

interface Memory {
  sources: { [room: string]: { [source: string]: number } };
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
