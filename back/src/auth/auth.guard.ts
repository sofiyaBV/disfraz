import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
      
        console.log('Authorization Header:', request.headers.authorization);
        console.log('Extracted Token:', token);
      
        if (!token) {
          console.log('No token found, throwing UnauthorizedException');
          throw new UnauthorizedException();
        }
      
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
          });
      
          console.log('Decoded JWT Payload:', payload);
      
          request['user'] = payload;
        } catch (error) {
          console.error('JWT Verification Error:', error.message);
          throw new UnauthorizedException();
        }
        return true;
      }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  