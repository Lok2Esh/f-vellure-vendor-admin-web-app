const path = require('node:path');
const backend = path.resolve(__dirname, '../../vellure-backend');
require(path.join(backend,'node_modules/dotenv')).config({path:path.join(backend,'.env'),quiet:true});
const {PrismaClient}=require(path.join(backend,'node_modules/@prisma/client'));
const prisma=new PrismaClient();
(async()=>{
 const user=await prisma.user.findUnique({where:{email:'lokeshrattan3@gmail.com'},select:{id:true,status:true,userRoles:{select:{role:{select:{name:true}}}}}});
 const role=await prisma.role.findUnique({where:{name:'SUPER_ADMIN'},select:{id:true}});
 console.log(JSON.stringify({accountExists:!!user,status:user?.status,roles:user?.userRoles.map(item=>item.role.name),superAdminRoleExists:!!role}));
})().catch(()=>{console.error('Unable to inspect administrator provisioning. Check backend database connectivity.');process.exitCode=1}).finally(()=>prisma.$disconnect());
