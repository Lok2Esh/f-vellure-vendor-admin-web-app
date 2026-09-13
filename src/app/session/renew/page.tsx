"use client";
import { useEffect, useState } from 'react';
import { refreshSession } from '@/platform/api/client';
import { Card, Heading, NavLink, Notice, Stack } from '@/components/portal/ui';
export default function RenewSession(){const [error,setError]=useState('');useEffect(()=>{let active=true;refreshSession().then(()=>{if(!active)return;const next=new URLSearchParams(window.location.search).get('next')||'/vendor/dashboard';const target=/^\/(vendor|admin)(\/|$)/.test(next)&&!next.includes('\\')?next:'/vendor/dashboard';window.location.replace(target)}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[]);return <Stack className="v-login"><Card><Stack><Heading>Restoring your session</Heading>{error?<><Notice tone="error">{error}</Notice><NavLink href="/login">Sign in again</NavLink></>:<Notice>Please wait while we securely renew your session.</Notice>}</Stack></Card></Stack>}
