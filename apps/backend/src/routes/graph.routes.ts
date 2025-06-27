import { Router } from "express";
import { verifyUser } from "../middleware/auth";

import * as graphController from "../controllers/graph.contoller";

const router = Router();

// app.use("/api/graph", graphRoutes);

// Get all contact nodes and edges
router.get("/nodes", verifyUser, graphController.getAllNodes);

router.get("/edges", verifyUser, graphController.getAllEdges);

// Update the position of a contactnode
router.post("/position", verifyUser, graphController.setNodePosition);

// Create an edge
router.post("/edge", verifyUser, graphController.createEdge);

// Delete a connection
router.delete("/edge/:id", verifyUser, graphController.deleteEdge);

// Update a connection
router.patch("/edge/:id", verifyUser, graphController.updateEdge);

export default router;
