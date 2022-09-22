import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import Home from "../Home/Home";
import { GameServerBuild } from "../types";

const gameServerBuildsCluster1: Array<GameServerBuild> = [
  {
    apiVersion: "",
    kind: "",
    metadata: {
      name: "test_gameserverbuild1",
      namespace: "default",
    },
    spec: {
      buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
      titleID: "test-game1",
      standingBy: 2,
      max: 4,
      portsToExpose: [80],
      crashesToMarkUnhealthy: 0,
      template: {
        metadata: {}
      }
    },
    status: {
      currentActive: 1,
      currentStandingBy: 1,
      crashesCount: 3,
      currentPending: 4,
      currentInitializing: 5,
      health: "Healthy",
      currentStandingByReadyDesired: "1/1",
    }
  },
  {
    apiVersion: "",
    kind: "",
    metadata: {
      name: "test_gameserverbuild2",
      namespace: "default",
    },
    spec: {
      buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
      titleID: "test-game2",
      standingBy: 2,
      max: 4,
      portsToExpose: [80],
      crashesToMarkUnhealthy: 0,
      template: {
        metadata: {}
      }
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
]

const gameServerBuildsCluster2: Array<GameServerBuild> = [
  {
    apiVersion: "",
    kind: "",
    metadata: {
      name: "test_gameserverbuild1",
      namespace: "default",
    },
    spec: {
      buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
      titleID: "test-game1",
      standingBy: 2,
      max: 4,
      portsToExpose: [80],
      crashesToMarkUnhealthy: 0,
      template: {
        metadata: {}
      }
    },
    status: {
      currentActive: 3,
      currentStandingBy: 3,
      crashesCount: 3,
      currentPending: 4,
      currentInitializing: 5,
      health: "Healthy",
      currentStandingByReadyDesired: "3/3",
    }
  },
  {
    apiVersion: "",
    kind: "",
    metadata: {
      name: "test_gameserverbuild3",
      namespace: "default",
    },
    spec: {
      buildID: "85ffe8da-c82f-4035-86c5-9d2b5f42d6f6",
      titleID: "test-game2",
      standingBy: 2,
      max: 4,
      portsToExpose: [80],
      crashesToMarkUnhealthy: 0,
      template: {
        metadata: {}
      }
    },
    status: {
      currentActive: 4,
      currentStandingBy: 4,
      crashesCount: 3,
      currentPending: 4,
      currentInitializing: 5,
      health: "Healthy",
      currentStandingByReadyDesired: "4/4",
    }
  }
]

const server = setupServer(
  rest.get("http://thundernetescluster1:5001/api/v1/gameserverbuilds", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServerBuildsCluster1
    }))
  }),

  rest.get("http://thundernetescluster2:5001/api/v1/gameserverbuilds", (req, res, ctx) => {
    return res(ctx.json({
      items: gameServerBuildsCluster2
    }))
  }),
);

beforeEach(() => {
  const testClusters: Record<string, Record<string, string>> = {
    cluster1: {
      api: "http://thundernetescluster1:5001/api/v1/",
      allocate: "http://thundernetescluster1:5000/api/v1/allocate/"
    },
    cluster2: {
      api: "http://thundernetescluster2:5001/api/v1/",
      allocate: "http://thundernetescluster2:5000/api/v1/allocate/"
    },
  };
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home clusters={testClusters} />} />
      </Routes>
    </MemoryRouter>
  );
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('shows a summary of all clusters', async () => {
  const totalStandingByString = "Total Standing By10";
  const totalStandingBy = await screen.findByText(new RegExp(totalStandingByString));
  expect(totalStandingBy).toBeInTheDocument();

  const totalActiveString = "Total Active10";
  const totalActive= await screen.findByText(new RegExp(totalActiveString));
  expect(totalActive).toBeInTheDocument();

  const cluster1String = "cluster1 3 3";
  const cluster1Row = await screen.findByRole("row", { name: new RegExp(cluster1String) });
  expect(cluster1Row).toBeInTheDocument();

  const cluster2String = "cluster2 7 7";
  const cluster2Row = await screen.findByRole("row", { name: new RegExp(cluster2String) });
  expect(cluster2Row).toBeInTheDocument();

  const build11String = "test_gameserverbuild1 cluster1 1 1";
  const build11Row = await screen.findByRole("row", { name: new RegExp(build11String) });
  expect(build11Row).toBeInTheDocument();

  const build12String = "test_gameserverbuild1 cluster2 3 3";
  const build12Row = await screen.findByRole("row", { name: new RegExp(build12String) });
  expect(build12Row).toBeInTheDocument();

  const build2String = "test_gameserverbuild2 cluster1 2 2";
  const build2Row = await screen.findByRole("row", { name: new RegExp(build2String) });
  expect(build2Row).toBeInTheDocument();

  const build3String = "test_gameserverbuild3 cluster2 4 4";
  const build3Row = await screen.findByRole("row", { name: new RegExp(build3String) });
  expect(build3Row).toBeInTheDocument();
});
