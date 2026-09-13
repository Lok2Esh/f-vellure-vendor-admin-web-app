import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiFailure, assertOrigin } from '@/platform/api/backend';
import { readUser } from '@/platform/api/auth-server';
import { ApiError } from '@/platform/api/contracts';
export async function POST(request:NextRequest){try{assertOrigin(request);const user=await readUser();const body=await request.json();if(typeof body.vendorId!=='string'||!user.vendorIds.includes(body.vendorId))throw new ApiError(403,'VENDOR_ACCESS_DENIED','You are not a member of this vendor.');(await cookies()).set('vellure_vendor',body.vendorId,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*86400});return NextResponse.json({data:{vendorId:body.vendorId}})}catch(error){return apiFailure(error)}}
