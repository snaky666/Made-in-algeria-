import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

import { insertLead, getLeadsToContact, markAsContacted } from './services/supabase.js'
import { sendTelegramMessage, sendEmail, sendMetaMessage } from './services/senders.js'

dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 7070

app.get('/', (req, res) => res.send('Nova Web - Agent AI backend up'))

app.post('/api/leads', async (req, res) => {
  try {
    const lead = req.body
    const r = await insertLead(lead)
    res.json({ ok: true, data: r })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: err.message })
  }
})

// start worker (simple polling)
let workerRunning = false
app.post('/api/start-worker', async (req, res) => {
  if (workerRunning) return res.json({ ok: true, message: 'worker already running' })
  workerRunning = true

  (async function worker(){
    console.log('Worker started')
    while(workerRunning){
      try{
        const leads = await getLeadsToContact(5)
        if(!leads || leads.length === 0){
          await new Promise(r => setTimeout(r, 15000))
          continue
        }
        for(const lead of leads){
          const name = lead.name || ''
          const msg = `سلام ${name} 👋\nأنا من شركة ${process.env.COMPANY_NAME}. شفت النشاط تاعكم ونقدروا نعاونكم نبنيو موقع ويب يخدم البيع والدفع. تحب نبعثلك أمثلة ولا نرتبو مكالمة قصيرة؟`

          if(lead.platform === 'telegram' && lead.identifier){
            await sendTelegramMessage(lead.identifier, msg)
          } else if (lead.platform === 'email' && lead.identifier){
            await sendEmail(lead.identifier, `عرض من ${process.env.COMPANY_NAME}`, msg)
          } else if ((lead.platform === 'facebook' || lead.platform === 'instagram') && lead.identifier){
            // send via Meta (placeholder)
            await sendMetaMessage(lead.identifier, msg, lead.platform)
          }

          await markAsContacted(lead.id)
          await new Promise(r => setTimeout(r, 3000))
        }
      } catch(e){
        console.error('Worker error', e)
        await new Promise(r => setTimeout(r, 5000))
      }
    }
  })()

  res.json({ ok: true, message: 'worker started' })
})

app.post('/api/stop-worker', (req, res) => {
  workerRunning = false
  res.json({ ok: true, message: 'worker stopping' })
})

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`))
