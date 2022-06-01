import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import ClusterDetail from './ClusterDetail';

const gameServerBuildsResponse = [
  {
    apiVersion: "",
    kind: "",
    metadata: {
      name: "test_gameserverbuild",
      namespace: "default",
    },
    spec: {
      buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
      standingBy: 0,
      max: 0,
      portsToExpose: [],
      crashesToMarkUnhealthy: 0
    },
    status: {
      currentActive: 2,
      currentStandingBy: 0,
      crashesCount: 0,
      currentPending: 0,
      currentInitializing: 0,
      health: "Healthy",
      currentStandingByReadyDesired: "2/2",
    }
  }
]

const gameServersResponse = [
  {
    metadata: {
      name: "test_gameserver1",
      namespace: "default"
    },
    status: {
      state: "Active",
      health: "Healthy",
      publicIP: "",
      ports: "",
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
      publicIP: "",
      ports: "",
      nodeName: "test_node2"
    }
  }
]

const server = setupServer(
  rest.get("http://thundernetescluster1:5001/api/v1/gameserverbuilds", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServerBuildsResponse
    }))
  }),

  rest.get("http://thundernetescluster1:5001/api/v1/gameservers", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServersResponse
    }))
  }),
);

beforeEach(() => {
  const testClusters: Record<string, Record<string, string>> = {
    cluster1: {
      api: "http://thundernetescluster1:5001/api/v1/",
      allocate: ""
    }
  };
  render(
    <MemoryRouter initialEntries={["/cluster1"]}>
      <Routes>
        <Route path="/:clusterName" element={<ClusterDetail clusters={testClusters} />} />
      </Routes>
    </MemoryRouter>
  );
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('shows a table with gameserverbuilds', async () => {
  let gsbRowValuesString = gameServerBuildsResponse[0].metadata.name;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].spec.buildID;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].metadata.namespace;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].status.currentActive;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].status.currentStandingByReadyDesired;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].status.crashesCount;
  gsbRowValuesString += " " + gameServerBuildsResponse[0].status.health;
  const gsbRow = await screen.findByRole("row", { name: new RegExp(gsbRowValuesString) });
  expect(gsbRow).toBeInTheDocument();
});

it('shows a table with nodes', async () => {
  let nodeRowValuesString1 = gameServersResponse[0].status.nodeName;
  nodeRowValuesString1 += " 1 0";
  const nodeRow1 = await screen.findByRole("row", { name: new RegExp(nodeRowValuesString1) });
  expect(nodeRow1).toBeInTheDocument();

  let nodeRowValuesString2 = gameServersResponse[1].status.nodeName;
  nodeRowValuesString2 += " 0 1";
  const nodeRow2 = await screen.findByRole("row", { name: new RegExp(nodeRowValuesString2) });
  expect(nodeRow2).toBeInTheDocument();
});
