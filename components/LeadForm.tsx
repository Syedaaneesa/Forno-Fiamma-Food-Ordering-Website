'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

export function LeadForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  async function submit(formData: FormData) {
    setState('sending')
    const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData)) })
    setState(response.ok ? 'success' : 'error')
  }
  if (state === 'success') return <div className="card" style={{padding:24, display:'flex', gap:12, alignItems:'center'}}><CheckCircle2 color="var(--green)" /><div><strong>We’ve got it.</strong><p className="muted" style={{margin:'4px 0 0'}}>Someone from our team will be in touch shortly.</p></div></div>
  return <form action={submit} style={{display:'grid', gap:12}}>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}><input className="field" name="name" placeholder="Your name" required /><input className="field" type="email" name="email" placeholder="Email address" required /></div>
    <input className="field" name="phone" placeholder="Phone (optional)" />
    <textarea className="field" name="message" placeholder="Tell us what you’re planning…" rows={4} required />
    <input type="hidden" name="source" value="contact-section" />
    {state === 'error' && <p style={{color:'var(--danger)',fontSize:13,margin:0}}>Please check the form and try again.</p>}
    <button className="button button-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : <>Send enquiry <ArrowUpRight size={15}/></>}</button>
  </form>
}
