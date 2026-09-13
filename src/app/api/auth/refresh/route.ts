import { NextRequest, NextResponse } from 'next/server';
import { apiFailure, assertOrigin } from '@/platform/api/backend';
import { readUser, refreshTokens, authRedirect, clearTokens } from '@/platform/api/auth-server';
import { ApiError } from '@/platform/api/contracts';
export async function POST(request:NextRequest){try{
 assertOrigin(request);
 // A second tab may arrive after rotation. Verify its current cookie first to avoid replaying a consumed token.
 try{const user=await readUser();return NextResponse.json({data:{user,redirect:authRedirect(user)}})}catch(error){if(!(error instanceof ApiError)||error.status!==401)throw error}
 const pair=await refreshTokens();return NextResponse.json({data:{user:pair.user,redirect:authRedirect(pair.user)}},{headers:{'Cache-Control':'no-store'}});
}catch(error){if(error instanceof ApiError&&error.status===401)await clearTokens();return apiFailure(error)}}
