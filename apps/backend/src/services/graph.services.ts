import { NodePosition, Edge } from "../schemas/graph.schema";
import { supabase } from "../lib/supabase/server";
import { ContactNode } from "@shared-types/network-graph";

export const getAllNodes = async (userId: string) => {
  const { data: contacts, error: contactError } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, organization, position, avatar_url")
    .eq("user_id", userId);

  if (contactError) return { data: {}, error: contactError };

  let compiledData: ContactNode[] = [];
  contacts.forEach((contact) => {
    const contactPosition = { x: 0, y: 0 };

    let node: ContactNode = {
      id: contact.id,
      data: {
        label: "hardcoded label",
        avatarUrl: contact.avatar_url || "",
      },
      first_name: contact.first_name || "",
      last_name: contact.last_name || "",
      organization: contact.organization || "",
      title: contact.position || "",
      position: contactPosition,
    };
    compiledData.push(node);
  });

  return { data: compiledData, error: contactError };
};

// interface ContactNode {
//   id: string;
//   data: {
//     label: string;
//     avatarUrl?: string;
//   };
//   organization?: string;
//   title?: string;
//   position?: { x: number; y: number };
// }

export const getAllEdges = async (userId: string) => {
  const data = {};
  const error = { message: "" };
  return { data, error };
};

export const updateNodePosition = async (nodeData: NodePosition) => {
  // change to node position data type
  const data = {};
  const error = { message: "" };
  return { data, error };
};
export const createEdge = async (validatedData: Edge) => {
  // change to edge data type
  const data = {};
  const error = { message: "" };
  return { data, error };
};
export const deleteEdge = async (edgeId: string) => {
  const data = {};
  const error = { message: "" };
  return { data, error };
};
export const updateEdge = async (validatedData: Edge) => {
  // change to edge data type
  const data = {};
  const error = { message: "" };
  return { data, error };
};
