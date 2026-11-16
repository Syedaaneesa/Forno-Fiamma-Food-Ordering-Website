'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LockKeyhole } from 'lucide-react'

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const signup = mode === 'signup'
  const [form, setForm] = useState({ name:'', email:'', password:'', signupCode:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setLoading(true); const response = await fetch(`/api/auth/${mode}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) }); const data = await response.json(); setLoading(false); if (!response.ok) { setError(data.error || 'Something went wrong.'); return } window.location.href = '/admin' }
  return <main className="login-wrap"><div className="login-card"><Link href="/" className="muted" style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:12}}><ArrowLeft size={14}/> Back to Forno & Fiamma</Link><div style={{marginTop:38,color:'var(--ember)'}}><LockKeyhole size={24}/></div><span className="eyebrow" style={{display:'block',marginTop:18}}>Forno & Fiamma / operations</span><h1 className="serif">{signup ? 'Create access.' : 'Welcome back.'}</h1><p className="muted" style={{lineHeight:1.7,fontSize:13}}>{signup ? 'Set up the first superadmin account for your restaurant dashboard.' : 'Sign in to review orders, leads, menu performance, and client footprint.'}</p><form onSubmit={submit}>{signup && <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} required/>}<input className="field" type="email" placeholder="Admin email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} required/><input className="field" type="password" placeholder={signup ? 'Password (8+ characters)' : 'Password'} value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} required minLength={signup ? 8 : undefined}/>{signup && <input className="field" placeholder="Signup code (if required)" value={form.signupCode} onChange={(e) => setForm({...form,signupCode:e.target.value})}/>} {error && <p style={{color:'var(--danger)',fontSize:13,margin:0}}>{error}</p>}<button className="button button-primary" disabled={loading}>{loading ? 'Checking…' : signup ? 'Create superadmin account' : 'Sign in to dashboard'}</button></form><p className="link-line" style={{marginTop:20}}>{signup ? <>Already have access? <Link href="/admin/login">Sign in</Link></> : <>Need the first account? <Link href="/admin/signup">Create it</Link></>}</p></div></main>
}
