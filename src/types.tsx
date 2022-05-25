interface GameServerBuild {
  apiVersion: string,
  kind: string,
  metadata: {
    name: string,
    namespace: string,
  },
  spec: {
    buildID: string,
    standingBy: number,
    max: number,
    portsToExpose: Array<number>,
    crashesToMarkUnhealthy: number
  },
  status: {
    currentActive: number,
    currentStandingBy: number,
    crashesCount: number,
    currentPending: number,
    currentInitializing: number,
    health: string,
    currentStandingByReadyDesired: string,
  }
}

interface GameServer {
  metadata: {
    name: string,
    namespace: string
  },
  status: {
    state: string,
    health: string,
    publicIP: string,
    ports: string
  }
}

const emptyGameServerBuild: GameServerBuild = {
  apiVersion: "",
  kind: "",
  metadata: {
    name: "",
    namespace: "",
  },
  spec: {
    buildID: "",
    standingBy: 0,
    max: 0,
    portsToExpose: [],
    crashesToMarkUnhealthy: 0
  },
  status: {
    currentActive: 0,
    currentStandingBy: 0,
    crashesCount: 0,
    currentPending: 0,
    currentInitializing: 0,
    health: "",
    currentStandingByReadyDesired: "",
  }
}

const emtpyGameServer: GameServer = {
  metadata: {
    name: "",
    namespace: ""
  },
  status: {
    state: "",
    health: "",
    publicIP: "",
    ports: ""
  }
}

export type { GameServerBuild, GameServer };
export { emptyGameServerBuild, emtpyGameServer };
