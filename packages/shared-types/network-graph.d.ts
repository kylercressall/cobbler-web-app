// Typing for the network graph component

export interface ContactNode {
  id: string;
  data: {
    label: string;
    avatarUrl?: string;
  };
  first_name?: string;
  last_name?: string;
  organization?: string;
  title?: string;
  position?: { x: number; y: number };
}

export type Edge = {
  id: string;
  source: string; // source and target are the id's in the contact nodes
  target: string;
  label?: string;
  type?: string; // reactflow type
};
