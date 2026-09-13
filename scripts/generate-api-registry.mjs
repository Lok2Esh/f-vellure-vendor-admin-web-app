import fs from 'node:fs';
const reference=fs.readFileSync('docs/api/vellure_api_reference.md','utf8').split('## 3. Full Platform API Blueprint')[1].split('## 4.')[0];
const definitions={};
for(const row of reference.split('\n')){
 const match=row.match(/^\|\s*`(GET|POST|PUT|PATCH|DELETE)`\s*\|\s*`([^`]+)`\s*\|\s*([^|]+)\|/);if(!match)continue;
 const [,method,path,rawAccess]=match;const access=rawAccess.trim();
 const key=method.toLowerCase()+path.split('/').filter(Boolean).map(part=>part.startsWith(':')?'By'+part.slice(1,2).toUpperCase()+part.slice(2):part.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('')).join('');
 const audience=access.includes('Webhook')?'webhook':access.includes('Public')?'public':access.includes('Admin')&&access.includes('Vendor')?'admin-vendor':access==='Admin'?'admin':access.includes('Customer')&&access.includes('Vendor')?'customer-vendor':access==='Customer'?'customer':access==='Vendor Owner'?'vendor-owner':'vendor';
 definitions[key]={method,path,audience,availability:'blueprint'};
}
const header=`// Generated from docs/api/vellure_api_reference.md. Run npm run api:generate after updating the reference.\nexport interface EndpointDefinition { method:'GET'|'POST'|'PUT'|'PATCH'|'DELETE';path:string;audience:'public'|'customer'|'vendor'|'vendor-owner'|'admin'|'admin-vendor'|'customer-vendor'|'webhook';availability:'live'|'blueprint' }\n`;
fs.writeFileSync('src/platform/api/endpoints.ts',header+'export const endpoints = '+JSON.stringify(definitions,null,2)+' as const satisfies Record<string,EndpointDefinition>;\nexport type EndpointKey=keyof typeof endpoints;\n');
console.log(`Generated ${Object.keys(definitions).length} documented business endpoints.`);
