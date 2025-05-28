// The shared-types folder will be the
//    shared data types that we will use on the frontend/backend.
// This is used to standardize everything

// Example data

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  lastContacted: Date;
}
