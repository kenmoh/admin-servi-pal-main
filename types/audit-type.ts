export type AuditLog = {
  id: string;
  timestamp: string; // ISO date string
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string;
  resource_summary: string;
  changes: {
    [key: string]: string[];
  };
  ip_address: string;
  extra_metadata: {
    [key: string]: Record<string, any>;
  };
};


