import { BadRequestError } from '@utils/errors'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Request, Response, NextFunction } from 'express'
import maxmind, { CityResponse, Reader } from 'maxmind'

import path from 'node:path'

interface SessionData {
  ip: string
  country: string
  city: string
  lat: number
  lon: number
}

let lookup: Reader<CityResponse> | null = null

export function sessionMiddleware(db: NodePgDatabase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { payload } = req.body

        if (!payload) {
          throw new BadRequestError('Invalid payload.');
        }

        // Init Database lookup
        if (lookup === null) {
          const dir = path.join(process.cwd(), 'geo');
          lookup = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
        }

        const ip = req.ip as string

        const result = lookup.get(ip)

        const session: SessionData = {
          ip,
          country: result?.country?.iso_code || 'US',
          city: result?.city?.names?.en || 'New York',
          lat: result?.location?.latitude || 40.7128,
          lon: result?.location?.longitude || -74.0060
        };

        (req as any).session = session
    
        next()
    }
}