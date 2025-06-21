import { AuthedRequest } from "../types/express";
import { Response } from "express";

import * as graphServices from "../services/graph.services";
import { NodePositionSchema, EdgeSchema } from "../schemas/graph.schema";

// // Get all ContactNodes and edges
export const getAllNodesAndEdges = async (
  req: AuthedRequest,
  res: Response
) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    const { data: nodeData, error: nodeError } =
      await graphServices.getAllNodes(userId);
    // const { data: edgeData, error: edgeError } =
    //   await graphServices.getAllEdges(userId);

    if (nodeError) {
      res.status(500).json({ error: nodeError.message });
      return;
    }
    // if (edgeError) {
    //   res.status(500).json({ error: edgeError.message });
    //   return;
    // }

    // const data = {
    //   nodes: nodeData,
    //   // edges: edgeData,
    // };

    console.log(nodeData);

    res.status(200).json(nodeData ?? []); // don't give null if no data
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const setNodePosition = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    // make sure we got the right data from req.body
    const parseResult = NodePositionSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", issues: parseResult.error });
      return;
    }

    const validatedData = parseResult.data;

    const { data, error } = await graphServices.updateNodePosition(
      validatedData
    );

    if (error) {
      res.status(500).json({ error: "Error updating node coordinates" });
      return;
    }

    res.status(200);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const createEdge = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    // make sure we got the right data from req.body
    const parseResult = EdgeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", issues: parseResult.error });
      return;
    }

    const validatedData = parseResult.data;

    const { data, error } = await graphServices.createEdge(validatedData);

    if (error) {
      console.error("Insert edge error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteEdge = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    const edgeId = req.params.id;
    const { data, error } = await graphServices.deleteEdge(edgeId);

    if (error) {
      console.error("Delete edge error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updateEdge = async (req: AuthedRequest, res: Response) => {
  const userId = req.user?.id || "";
  if (!userId) res.status(400).json({ error: "User ID is required" });

  try {
    // make sure we got the right data from req.body
    const parseResult = EdgeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res
        .status(400)
        .json({ error: "Invalid input", issues: parseResult.error });
      return;
    }

    const validatedData = parseResult.data;

    const { data, error } = await graphServices.updateEdge(validatedData);

    if (error) {
      console.error("Update edge error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
