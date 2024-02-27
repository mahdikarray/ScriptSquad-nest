import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // Vérifier si c'est une requête OPTIONS (pré-vérification CORS)
    if (req.method === 'OPTIONS') {
      res.sendStatus(200); // Répondre avec succès pour les pré-vérifications
    } else {
      next(); // Passer au prochain middleware
    }
  }
}
