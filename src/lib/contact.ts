import { createClient } from "./supabase/server";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  interest: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ContactSubmissionRow {
  id: string;
  name: string;
  email: string;
  organisation: string | null;
  interest: string;
  message: string;
  read: boolean;
  created_at: string;
}

function mapRow(row: ContactSubmissionRow): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    organisation: row.organisation,
    interest: row.interest,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ContactSubmissionRow[]).map(mapRow);
}
