import {
  NodePosition,
  Edge,
  NodePositionSchema,
} from "../schemas/graph.schema";
import { supabase } from "../lib/supabase/server";
import { ContactNode } from "@shared-types/network-graph";
import { Contact } from "@shared-types/user-data";

export const getAllNodes = async (userId: string) => {
  const { data: contacts, error: contactError } = await supabase
    .from("contacts")
    .select("id, first_name, last_name, organization, position, avatar_url")
    .eq("user_id", userId)
    .order("last_name")
    .order("first_name");

  if (contactError) return { data: {}, error: contactError };

  let compiledData: ContactNode[] = [];
  for (const contact of contacts) {
    const { x: nodeX, y: nodeY, error } = await getContactPosition(contact.id);
    if (error) console.error("node position fetch error:", error);

    let node: ContactNode = {
      id: contact.id,
      data: {
        label: `${contact.first_name} ${contact.last_name}`,
        avatarUrl: contact.avatar_url || "",
      },
      first_name: contact.first_name || "",
      last_name: contact.last_name || "",
      organization: contact.organization || "",
      title: contact.position || "",
      position: { x: nodeX, y: nodeY },
    };
    compiledData.push(node);
  }

  return { data: compiledData, error: contactError };
};

const getContactPosition = async (contactId: string) => {
  const { data, error } = await supabase
    .from("graph_contact_positions")
    .select("x, y")
    .eq("contact_id", contactId)
    .maybeSingle();

  return {
    x: data?.x ?? 0,
    y: data?.y ?? 0,
    error,
  };
};

export const getAllEdges = async (userId: string) => {
  const { data: contacts, error: contactError } = await supabase
    .from("contacts")
    .select("id")
    .eq("user_id", userId)
    .order("last_name")
    .order("first_name");

  if (contactError) return { data: {}, error: contactError };

  let edges: Edge[] = [];
  for (const contact of contacts) {
    const { data, error } = await supabase
      .from("graph_edges")
      .select("id, source, target")
      .eq("source", contact.id);
    if (error) return { data: [], error: error };
    if (data) edges.push(...data);
  }

  console.log("edges:", edges);
  return { edges, error: null };
};

export const updateNodePosition = async (nodeData: NodePosition) => {
  // change to node position data type
  const { id, x, y } = nodeData;
  const { data: xData, error: xError } = await supabase
    .from("graph_contact_positions")
    .update({ x: x })
    .eq("id", id);
  const { data: yData, error: yError } = await supabase
    .from("graph_contact_positions")
    .update({ y: y })
    .eq("id", id);

  let error = {};
  if (xError) error = { error: xError };
  else if (yError) error = { error: yError };
  else error = { error: null };

  return { data: nodeData, error };
};

// export const EdgeSchema = z.object({
//   id: z.string().uuid(),
//   source: z.string().uuid(),
//   target: z.string().uuid(),
//   label: z.string().optional(),
//   type: z.string().optional(), // reactflow type
// });

export const createEdge = async (validatedData: Edge) => {
  const { data, error } = await supabase
    .from("graph_edges")
    .insert({ validatedData });

  return { data, error };
};
export const deleteEdge = async (edgeId: string) => {
  const { data, error } = await supabase
    .from("graph_edges")
    .delete()
    .eq("id", edgeId);

  return { data, error };
};
export const updateEdge = async (validatedData: Edge) => {
  const data = {};
  const error = { message: "" };
  return { data, error };
};
