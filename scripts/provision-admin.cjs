// Explicit operator bootstrap; never imported by the web application or public registration.
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const backend=path.resolve(__dirname,'../../vellure-backend');
require(path.join(backend,'node_modules/dotenv')).config({path:path.join(backend,'.env'),quiet:true});
const {PrismaClient}=require(path.join(backend,'node_modules/@prisma/client'));
const argon2=require(path.join(backend,'node_modules/argon2'));
const prisma=new PrismaClient();
const email='lokeshrattan3@gmail.com';
const phone=process.argv[2];
const adminRoles=['SUPER_ADMIN','OPERATIONS_ADMIN','FINANCE_ADMIN','SUPPORT_AGENT','CONTENT_MANAGER','MODERATOR'];
(async()=>{
 if(!/^\+91[6-9]\d{9}$/.test(phone||''))throw new Error('Supply the administrator mobile number in +91 format.');
 const existing=await prisma.user.findUnique({where:{email},select:{id:true}});
 const password=existing?null:`V!${crypto.randomBytes(24).toString('base64url')}8a`;
 const passwordHash=password?await argon2.hash(password,{type:argon2.argon2id}):null;
 const role=await prisma.role.findUnique({where:{name:'SUPER_ADMIN'}});
 if(!role)throw new Error('Seed backend RBAC roles before provisioning.');
 const result=await prisma.$transaction(async tx=>{
  const user=existing?await tx.user.update({where:{id:existing.id},data:{status:'ACTIVE'}}):await tx.user.create({data:{email,phone,firstName:'Vellure',lastName:'Administrator',passwordHash,status:'ACTIVE'}});
  const priorAdmins=await tx.userRole.findMany({where:{role:{name:{in:adminRoles}},userId:{not:user.id}},select:{userId:true,role:{select:{name:true}}}});
  const formerIds=[...new Set(priorAdmins.map(item=>item.userId))];
  await tx.userRole.deleteMany({where:{role:{name:{in:adminRoles}},userId:{not:user.id}}});
  await tx.userSession.updateMany({where:{userId:{in:formerIds}},data:{isRevoked:true}});
  await tx.userRole.upsert({where:{userId_roleId:{userId:user.id,roleId:role.id}},create:{userId:user.id,roleId:role.id},update:{}});
  const permissions=await tx.permission.findMany({select:{id:true}});
  await tx.rolePermission.createMany({data:permissions.map(permission=>({roleId:role.id,permissionId:permission.id})),skipDuplicates:true});
  await tx.auditLog.create({data:{actorType:'SYSTEM',actorId:user.id,action:'SINGLE_ADMIN_PROVISIONED',entityType:'User',entityId:user.id,before:{otherAdministrators:priorAdmins},after:{administratorId:user.id,role:'SUPER_ADMIN'},metadata:{source:'operator-bootstrap',sessionsRevokedFor:formerIds}}});
  return {id:user.id,revoked:formerIds.length};
 },{timeout:20000});
 if(password){const directory=path.resolve(__dirname,'../.local');fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'admin-credentials.txt'),`Vellure administrator\nEmail: ${email}\nTemporary password: ${password}\nSign in: http://localhost:3001/login\nKeep this file private. Rotate this password through the backend before deployment.\n`,{mode:0o600});}
 console.log(JSON.stringify({email,created:!existing,otherAdminAccessRevoked:result.revoked,credentialsFile:password?'.local/admin-credentials.txt':'Existing password preserved'}));
})().catch(error=>{console.error(error.message?.startsWith('Supply')?error.message:'Administrator provisioning failed. No credentials are printed. Verify the backend database and unique mobile number.');process.exitCode=1}).finally(()=>prisma.$disconnect());
