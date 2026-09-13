const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../vellure-backend/src/modules/features');
const guard=path.join(root,'feature-scope.guard.ts');
if(fs.existsSync(guard))throw new Error('Guard already exists; review it rather than overwrite.');
const controller=path.join(root,'features.controller.ts'),modulePath=path.join(root,'features.module.ts');
const source=fs.readFileSync(controller,'utf8'),moduleSource=fs.readFileSync(modulePath,'utf8');
if(!source.includes('@UseGuards(JwtAuthGuard, RolesGuard)')||!moduleSource.includes('providers: [FeaturesService]'))throw new Error('Backend structure changed; inspect before applying.');
const content=`import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RequestUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class FeatureScopeGuard implements CanActivate {
 constructor(private readonly prisma: PrismaService) {}
 async canActivate(context: ExecutionContext): Promise<boolean> {
  const request=context.switchToHttp().getRequest();
  const user=request.user as RequestUser;
  if(!user || user.status !== 'ACTIVE') throw new ForbiddenException('Active account required');
  if(user.roles.includes('SUPER_ADMIN')) {
   const email=process.env.VELLURE_ADMIN_EMAIL?.trim().toLowerCase();
   if(!email || user.email.toLowerCase() !== email) throw new ForbiddenException('Administrator not authorized');
   return true;
  }
  if(!user.roles.includes('VENDOR_OWNER') || ['DELETE','PUT'].includes(request.method)) throw new ForbiddenException('Vendor operation not allowed');
  const vendorId=user.currentVendorId || user.vendorIds[0];
  if(!vendorId || !user.vendorIds.includes(vendorId)) throw new ForbiddenException('Vendor membership required');
  if(request.query.vendorId && request.query.vendorId !== vendorId) throw new ForbiddenException('Vendor scope mismatch');
  if(request.body?.vendorId && request.body.vendorId !== vendorId) throw new ForbiddenException('Vendor scope mismatch');
  if(request.params.id) {
   const feature=await this.prisma.feature.findUnique({where:{id:request.params.id},select:{vendorId:true}});
   if(!feature || feature.vendorId !== vendorId) throw new ForbiddenException('Feature does not belong to this vendor');
  }
  if(request.method === 'GET') Object.defineProperty(request,'query',{value:{...request.query,vendorId},configurable:true});
  else if(request.body && !request.path.endsWith('/toggle')) {
   if(request.body.placement && request.body.placement !== 'VENDOR_DETAIL') throw new ForbiddenException('Vendors can publish only on their business page');
   request.body.vendorId=vendorId;request.body.placement='VENDOR_DETAIL';
  }
  return true;
 }
}
`;
fs.writeFileSync(guard,content);
fs.writeFileSync(controller,"import { FeatureScopeGuard } from './feature-scope.guard';\n"+source.replaceAll('@UseGuards(JwtAuthGuard, RolesGuard)','@UseGuards(JwtAuthGuard, RolesGuard, FeatureScopeGuard)'));
fs.writeFileSync(modulePath,"import { FeatureScopeGuard } from './feature-scope.guard';\n"+moduleSource.replace('providers: [FeaturesService]','providers: [FeaturesService, FeatureScopeGuard]'));
console.log('Added backend feature ownership and single-administrator checks.');
