import { NextResponse } from 'next/server';
import { readUser } from '@/platform/api/auth-server';
import { apiFailure } from '@/platform/api/backend';
export async function GET(){try{return NextResponse.json({data:await readUser()},{headers:{'Cache-Control':'no-store'}})}catch(error){return apiFailure(error)}}
