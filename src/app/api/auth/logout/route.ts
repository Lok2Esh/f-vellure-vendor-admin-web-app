import { NextRequest, NextResponse } from 'next/server';
import { apiFailure, assertOrigin, backendFetch, cookieContext } from '@/platform/api/backend';
import { clearTokens, refreshTokens } from '@/platform/api/auth-server';
import { ApiError, errorFromResponse } from '@/platform/api/contracts';
export async function POST(request:NextRequest){try{
 assertOrigin(request);const context=await cookieContext();
 if(context.token){let response=await backendFetch('/auth/logout',{method:'POST'},context);
  if(response.status===401){try{const pair=await refreshTokens();response=await backendFetch('/auth/logout',{method:'POST'},{...context,token:pair.accessToken})}catch(error){if(!(error instanceof ApiError)||error.status!==401)throw error}}
  if(!response.ok&&response.status!==401)throw errorFromResponse(response.status,await response.json().catch(()=>null));
 }else{try{const pair=await refreshTokens();const res=await backendFetch('/auth/logout',{method:'POST'},{...context,token:pair.accessToken});if(!res.ok&&res.status!==401)throw errorFromResponse(res.status,await res.json().catch(()=>null))}catch(error){if(!(error instanceof ApiError)||error.status!==401)throw error}}
 await clearTokens();return NextResponse.json({data:{message:'Signed out.'}});
}catch(error){return apiFailure(error)}}
