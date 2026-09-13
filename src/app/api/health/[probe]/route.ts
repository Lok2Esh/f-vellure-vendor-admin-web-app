import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, apiFailure } from '@/platform/api/backend';
import { ApiError } from '@/platform/api/contracts';
export async function GET(_request:NextRequest,{params}:{params:Promise<{probe:string}>}){try{const {probe}=await params;if(!['status','liveness','readiness'].includes(probe))throw new ApiError(404,'NOT_FOUND','Unknown probe');const response=await backendFetch(probe==='status'?'/health':`/health/${probe}`,{},{root:true});return NextResponse.json({data:{available:response.ok,status:response.status}},{status:response.ok?200:503,headers:{'Cache-Control':'no-store'}})}catch(error){return apiFailure(error)}}
