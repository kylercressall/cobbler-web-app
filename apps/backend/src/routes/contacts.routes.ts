import { Router } from "express";
import { verifyUser } from "../middleware/auth";

import * as contactController from "../controllers/contacts.controller";

const router = Router();

// Get all contacts for the authed user, lightrweight
router.get("/", verifyUser, contactController.getBasicContacts);

// Create new contact and return it
router.post("/", verifyUser, contactController.createContact);

// Edit contact with new data
router.patch("/:id", verifyUser, contactController.editContact);

// Delete contact
router.delete("/:id", verifyUser, contactController.deleteContact);

// Get all contact details linked to the given contact
router.get("/:id/full", verifyUser, contactController.getFullContact);

export default router;
