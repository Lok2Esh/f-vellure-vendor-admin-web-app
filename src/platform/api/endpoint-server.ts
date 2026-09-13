import { NextRequest, NextResponse } from 'next/server';
import { endpoints, EndpointKey } from './endpoints';
import { apiFailure, assertOrigin, backendFetch, cookieContext } from './backend';
import { readUser } from './auth-server';
import { ApiError, adminRoles, vendorRoles, errorFromResponse } from './contracts';

/** Allowlisted transport only. Ownership, transition, price and inventory rules remain backend-owned. */
export async function forwardEndpoint(request:NextRequest,key:string){try{
 if(!Object.hasOwn(endpoints,key))throw new ApiError(404,'ENDPOINT_UNKNOWN','Unknown API operation.');
 const endpoint=endpoints[key as EndpointKey];if(request.method!==endpoint.method)throw new ApiError(405,'METHOD_NOT_ALLOWED','Method is not supported for this operation.');
 if(endpoint.audience==='webhook')throw new ApiError(403,'SERVER_ONLY','Payment webhooks must be delivered directly to the backend gateway receiver.');
 if(request.method!=='GET')assertOrigin(request);
 const context=await cookieContext();
 if(endpoint.audience!=='public'){
  const user=await readUser();const admin=user.roles.some(r=>adminRoles.includes(r));const vendor=user.roles.some(r=>vendorRoles.includes(r));const customer=user.roles.includes('CUSTOMER');
  const allowed=endpoint.audience==='admin'?admin:endpoint.audience==='vendor-owner'?user.roles.includes('VENDOR_OWNER'):endpoint.audience==='vendor'?vendor:endpoint.audience==='customer'?customer:endpoint.audience==='admin-vendor'?admin||vendor:customer||vendor;
  if(!allowed)throw new ApiError(403,'WORKSPACE_ACCESS_DENIED','Your role cannot access this operation.');
  const needsVendor=endpoint.audience==='vendor'||endpoint.audience==='vendor-owner'||(vendor&&!admin&&endpoint.audience.endsWith('-vendor'));
  if(needsVendor&&endpoint.path!=='/vendors/register'){
   context.vendorId=context.vendorId||user.vendorIds[0];if(!context.vendorId||!user.vendorIds.includes(context.vendorId))throw new ApiError(403,'VENDOR_ACCESS_DENIED','Select a vendor you belong to before continuing.');
  }else delete context.vendorId;
 }else{delete context.token;delete context.vendorId;}
 let path:string=endpoint.path;const query=new URLSearchParams(request.nextUrl.searchParams);
 for(const match of endpoint.path.matchAll(/:([A-Za-z]+)/g)){
  const value=query.get(`param.${match[1]}`);if(!value||value==='.'||value==='..'||! /^[\p{L}\p{N}_-]+$/u.test(value))throw new ApiError(400,'INVALID_PARAMETER',`Invalid ${match[1]}.`);
  path=path.replace(match[0],encodeURIComponent(value));query.delete(`param.${match[1]}`);
 }
 if([...query.keys()].some(k=>k.startsWith('param.')))throw new ApiError(400,'INVALID_PARAMETER','Unexpected path parameter.');
 if(query.size)path+=`?${query}`;
 const headers=new Headers();const idempotency=request.headers.get('idempotency-key');if(idempotency){if(idempotency.length>128)throw new ApiError(400,'INVALID_PARAMETER','Invalid idempotency key.');headers.set('Idempotency-Key',idempotency)}
 let body:BodyInit|undefined;
 if(!['GET','HEAD'].includes(request.method)){
  if(Number(request.headers.get('content-length')||0)>10*1024*1024)throw new ApiError(413,'PAYLOAD_TOO_LARGE','Request exceeds the upload limit.');
  if(request.headers.get('content-type')?.startsWith('multipart/form-data')){if(endpoint.path!=='/vendors/me/documents')throw new ApiError(415,'UNSUPPORTED_MEDIA_TYPE','This endpoint accepts JSON.');const form=await request.formData();let size=0;for(const value of form.values())size+=typeof value==='string'?value.length:value.size;if(size>10*1024*1024)throw new ApiError(413,'PAYLOAD_TOO_LARGE','Upload exceeds 10 MB.');body=form;}
  else {const raw=await request.text();if(raw.length>1024*1024)throw new ApiError(413,'PAYLOAD_TOO_LARGE','JSON request exceeds 1 MB.');if(raw){try{JSON.parse(raw)}catch{throw new ApiError(422,'VALIDATION_ERROR','Invalid JSON body.')}body=raw}}
 }
 const response=await backendFetch(path,{method:request.method,body,headers},context);
 if(response.status===204)return new NextResponse(null,{status:204});
 const payload:unknown=await response.json().catch(()=>null);if(!response.ok)throw errorFromResponse(response.status,payload);
 if(!payload||typeof payload!=='object'||!('data' in payload))throw new ApiError(502,'INVALID_RESPONSE','Expected the standard API response envelope.');
 return NextResponse.json(payload,{status:response.status,headers:{'Cache-Control':'private, no-store'}});
}catch(error){return apiFailure(error)}}
