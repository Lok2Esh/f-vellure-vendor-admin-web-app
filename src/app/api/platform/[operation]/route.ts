import { NextRequest } from 'next/server';
import { forwardEndpoint } from '@/platform/api/endpoint-server';
async function handler(request:NextRequest,{params}:{params:Promise<{operation:string}>}){return forwardEndpoint(request,(await params).operation)}
export {handler as GET,handler as POST,handler as PATCH,handler as PUT,handler as DELETE};
