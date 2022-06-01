import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { within } from "@testing-library/dom"
import { render, screen } from '@testing-library/react';
import GameServerBuildDetail from "./GameServerBuildDetail";
import { GameServer, GameServerBuild, GameServerDetail } from "./types";

const gameServerBuild: GameServerBuild = {
  apiVersion: "",
  kind: "",
  metadata: {
    name: "test_gameserverbuild",
    namespace: "default",
  },
  spec: {
    buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
    standingBy: 2,
    max: 4,
    portsToExpose: [80],
    crashesToMarkUnhealthy: 0
  },
  status: {
    currentActive: 2,
    currentStandingBy: 2,
    crashesCount: 3,
    currentPending: 4,
    currentInitializing: 5,
    health: "Healthy",
    currentStandingByReadyDesired: "2/2",
  }
}

const gameServers: Array<GameServer> = [
  {
    metadata: {
      name: "test_gameserver1",
      namespace: "default"
    },
    status: {
      state: "Active",
      health: "Healthy",
      publicIP: "11.111.111.111",
      ports: "80:10000",
      nodeName: "test_node1"
    }
  },
  {
    metadata: {
      name: "test_gameserver2",
      namespace: "default"
    },
    status: {
      state: "StandingBy",
      health: "Healthy",
      publicIP: "11.111.111.112",
      ports: "80:10001",
      nodeName: "test_node2"
    }
  }
]

const gameServerDetails: Array<GameServerDetail> = [
  {
    metadata: {
      name: "test_gameserver1",
      namespace: "default"
    },
    spec: {
      connectedPlayersCount: 2,
      connectedPlayers: []
    }
  },
  {
    metadata: {
      name: "test_gameserver2",
      namespace: "default"
    },
    spec: {
      connectedPlayersCount: 3,
      connectedPlayers: []
    }
  }
]

const server = setupServer(
  rest.get("http://thundernetescluster1:5001/api/v1/gameserverbuilds/" + gameServerBuild.metadata.namespace + "/" + gameServerBuild.metadata.name, (req, res, ctx) => {
    return res(ctx.json(gameServerBuild))
  }),

  rest.get("http://thundernetescluster1:5001/api/v1/gameserverbuilds/" + gameServerBuild.metadata.namespace + "/" + gameServerBuild.metadata.name + "/gameservers", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServers
    }))
  }),

  rest.get("http://thundernetescluster1:5001/api/v1/gameserverbuilds/" + gameServerBuild.metadata.namespace + "/" + gameServerBuild.metadata.name + "/gameserverdetails", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServerDetails
    }))
  }),
);

beforeEach(() => {
  const testClusters: Record<string, Record<string, string>> = {
    cluster1: {
      api: "http://thundernetescluster1:5001/api/v1/",
      allocate: "http://thundernetescluster1:5000/api/v1/allocate/"
    }
  };
  render(
    <MemoryRouter initialEntries={["/cluster1/gsb/" + gameServerBuild.metadata.namespace + "/" + gameServerBuild.metadata.name]}>
      <Routes>
        <Route path="/:clusterName/gsb/:namespace/:buildName" element={<GameServerBuildDetail clusters={testClusters} />} />
      </Routes>
    </MemoryRouter>
  );
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('shows a table with gameserverbuild specs', async () => {
  const gsbBuildIDString = "Build ID " + gameServerBuild.spec.buildID;
  const gsbBuildID = await screen.findByRole("row", { name: new RegExp(gsbBuildIDString) });
  expect(gsbBuildID).toBeInTheDocument();

  const gsbStandingBy = await within(await screen.findByRole("row", { name: /^StandingBy/ })).findByDisplayValue(2);
  expect(gsbStandingBy).toBeInTheDocument();

  const gsbMax = await within(await screen.findByRole("row", { name: /^Max/ })).findByDisplayValue(4);
  expect(gsbMax).toBeInTheDocument();

  let gsbPortsString = "Ports to Expose " + JSON.stringify(gameServerBuild.spec.portsToExpose);
  gsbPortsString = gsbPortsString.replace('[', '\\[').replace(']', '\\]');
  const gsbPorts = await screen.findByRole("row", { name: new RegExp(gsbPortsString) });
  expect(gsbPorts).toBeInTheDocument();

  const gsbCrashesString = "Crashes to mark Unhealthy " + gameServerBuild.spec.crashesToMarkUnhealthy;
  const gsbCrashes = await screen.findByRole("row", { name: new RegExp(gsbCrashesString) });
  expect(gsbCrashes).toBeInTheDocument();
});

it('shows a table with gameserverbuild specs', async () => {
  const gsbHealthString = "Health " + gameServerBuild.status.health;
  const gsbHealth = await screen.findByRole("row", { name: new RegExp(gsbHealthString) });
  expect(gsbHealth).toBeInTheDocument();

  const gsbStandingByString = "Current StandingBy " + gameServerBuild.status.currentStandingByReadyDesired;
  const gsbStandingBy = await screen.findByRole("row", { name: new RegExp(gsbStandingByString) });
  expect(gsbStandingBy).toBeInTheDocument();

  const gsbActiveString = "Current Active " + gameServerBuild.status.currentActive;
  const gsbActive = await screen.findByRole("row", { name: new RegExp(gsbActiveString) });
  expect(gsbActive).toBeInTheDocument();

  const gsbCrasesString = "Crashes Count " + gameServerBuild.status.crashesCount;
  const gsbCrashes = await screen.findByRole("row", { name: new RegExp(gsbCrasesString) });
  expect(gsbCrashes).toBeInTheDocument();

  const gsbInitString = "Current Initializing " + gameServerBuild.status.currentInitializing;
  const gsbInit = await screen.findByRole("row", { name: new RegExp(gsbInitString) });
  expect(gsbInit).toBeInTheDocument();

  const gsbPendingString = "Current Pending " + gameServerBuild.status.currentPending;
  const gsbPending = await screen.findByRole("row", { name: new RegExp(gsbPendingString) });
  expect(gsbPending).toBeInTheDocument();
});

it('shows a table with gameservers', async () => {
  let gsRowValuesString1 = gameServers[0].metadata.name;
  gsRowValuesString1 += " " + gameServers[0].metadata.namespace;
  gsRowValuesString1 += " " + gameServers[0].status.health;
  gsRowValuesString1 += " " + gameServers[0].status.state;
  gsRowValuesString1 += " " + gameServers[0].status.publicIP.replace('.', '\\.');
  gsRowValuesString1 += " " + gameServers[0].status.ports;
  gsRowValuesString1 += " " + gameServerDetails[0].spec.connectedPlayers;
  const gsRow1 = await screen.findByRole("row", { name: new RegExp(gsRowValuesString1) });
  expect(gsRow1).toBeInTheDocument();

  let gsRowValuesString2 = gameServers[1].metadata.name;
  gsRowValuesString2 += " " + gameServers[1].metadata.namespace;
  gsRowValuesString2 += " " + gameServers[1].status.health;
  gsRowValuesString2 += " " + gameServers[1].status.state;
  gsRowValuesString2 += " " + gameServers[1].status.publicIP.replace('.', '\\.');
  gsRowValuesString2 += " " + gameServers[1].status.ports;
  gsRowValuesString2 += " " + gameServerDetails[1].spec.connectedPlayers;
  const gsRow2 = await screen.findByRole("row", { name: new RegExp(gsRowValuesString2) });
  expect(gsRow2).toBeInTheDocument();
});
