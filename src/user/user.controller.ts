import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './create-user-dto/create-user-dto';


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

// **********************Register********************
@Post('register')
async register(@Body() body: { username: string; password: string; email: string }) {
  const { username, password, email } = body;
  const registrationResult = await this.userService.register(username, password, email);

  if (registrationResult.user) {
    // Si l'utilisateur a été enregistré avec succès, retourner l'utilisateur et un message de succès
    return { user: registrationResult.user, message: registrationResult.message };
  } else {
    // Si l'email existe déjà, retourner un message d'erreur
    return { message: registrationResult.message };
  }
}

// ********************Login*************************
    @Post('login')
    async login(@Body() body: { username: string, password: string }): Promise<any> {
    const { username, password } = body;
    const user = await this.userService.validateUser(username, password);
    if (user) {
      return this.userService.login(user) ;
    } else {
      return { message: 'Invalid credentials' };
    }
  }


 
// ********************verifyToken*********************

  @Get('')
  async verifToken(@Headers('authorization') authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authorizationHeader.split(' ')[1]; 
    try {
      const decodedToken = await this.userService.verifyToken(token); 
      return decodedToken; 
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); 
    }
  }


//   *****************get**********************

@Get('getAll')
async findAll(@Headers('authorization') authorizationHeader: string) {
  if (!authorizationHeader) {
    throw new UnauthorizedException('Authorization header is missing');
  }

  const token = authorizationHeader.split(' ')[1]; 

  try {
    const users = await this.userService.findAll();
    return users;
  } catch (error) {
    throw new UnauthorizedException('Invalid token');
  }
}





}
