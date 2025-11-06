import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export async function insertLead(lead){
  const payload = {
    platform: lead.platform || 'unknown',
    identifier: lead.identifier || null,
    name: lead.name || null,
    bio: lead.bio || null,
    location: lead.location || null,
    tags: lead.tags || [],
    score: lead.score || 0,
    status: 'new'
  }
  const { data, error } = await supabase.from('leads').insert([payload]).select()
  if (error) throw error
  return data[0]
}

export async function getLeadsToContact(limit = 10){
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('status', 'new')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function markAsContacted(id){
  const { data, error } = await supabase
    .from('leads')
    .update({ status: 'contacted', last_contacted_at: new Date() })
    .eq('id', id)
  if(error) throw error
  return data
}
