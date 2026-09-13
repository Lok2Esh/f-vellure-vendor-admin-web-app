import { NextRequest, NextResponse } from 'next/server';
import { apiFailure, assertOrigin, backendData } from '@/platform/api/backend';
import { loginSchema, tokenSchema, workspaceFor, ApiError } from '@/platform/api/contracts';
import { authRedirect, saveTokens } from '@/platform/api/auth-server';
export async function POST(request:NextRequest){try{
 assertOrigin(request);const result=loginSchema.safeParse(await request.json().catch(()=>null));if(!result.success)throw new ApiError(422,'VALIDATION_ERROR','Enter your email or phone and password.',result.error.flatten().fieldErrors);
 const pair=await backendData('/auth/login',tokenSchema,{method:'POST',body:JSON.stringify(result.data)});
 if(!workspaceFor(pair.user))throw new ApiError(403,'WORKSPACE_ACCESS_DENIED','This account does not have vendor or administration access.');
 await saveTokens(pair);return NextResponse.json({data:{user:pair.user,redirect:authRedirect(pair.user)}},{headers:{'Cache-Control':'no-store'}});
}catch(error){return apiFailure(error)}}
