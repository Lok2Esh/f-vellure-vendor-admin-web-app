import { NextRequest, NextResponse } from 'next/server';
import { apiFailure, assertOrigin, backendData } from '@/platform/api/backend';
import { registerSchema, tokenSchema, ApiError } from '@/platform/api/contracts';
import { authRedirect, saveTokens } from '@/platform/api/auth-server';
export async function POST(request:NextRequest){try{
 assertOrigin(request);const result=registerSchema.safeParse(await request.json().catch(()=>null));if(!result.success)throw new ApiError(422,'VALIDATION_ERROR','Check your registration details.',result.error.flatten().fieldErrors);
 const pair=await backendData('/auth/register',tokenSchema,{method:'POST',body:JSON.stringify(result.data)});await saveTokens(pair);
 return NextResponse.json({data:{user:pair.user,redirect:authRedirect(pair.user)}},{status:201,headers:{'Cache-Control':'no-store'}});
}catch(error){return apiFailure(error)}}
