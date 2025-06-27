import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getFetchToken } from "../../lib/getFetchToken";

import { initialNodes } from "./nodes";
import { initialEdges } from "./edges";

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const fetchContactNodes = async () => {
    try {
      const token = await getFetchToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/graph/nodes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      setNodes(data);
      console.log("nodes:", nodes);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  const fetchContactEdges = async () => {
    try {
      const token = await getFetchToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/graph/edges`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API response");

      setEdges(data);
      console.log("edges:", edges);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  useEffect(() => {
    fetchContactNodes();
    fetchContactEdges();
  }, []);

  // useEffect(() => {
  //   console.log("nodes:", nodes);
  //   console.log("edges:", edges);
  // }, [nodes, edges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}

export default Flow;
