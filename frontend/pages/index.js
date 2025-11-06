import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Dashboard(){
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      const { data } = await supabase.from('leads').select('*').order('created_at',{ascending:false}).limit(50)
      setLeads(data || [])
      setLoading(false)
    }
    load()
  },[])

  return (
    <div style={{padding:20,fontFamily:'Arial'}}>
      <h1>Nova Web - لوحة الزبائن</h1>
      {loading && <p>جارى التحميل...</p>}
      {!loading && leads.length === 0 && <p>ماكان حتى lead حتى الآن</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
        {leads.map(l=> (
          <div key={l.id} style={{border:'1px solid #ddd',padding:12,borderRadius:8}}>
            <h3>{l.name || l.identifier}</h3>
            <p><strong>المنصة:</strong> {l.platform}</p>
            <p><strong>حالة:</strong> {l.status}</p>
            <p style={{fontSize:12,color:'#444'}}>{l.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
