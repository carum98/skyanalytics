import { BadRequestError } from '@utils/errors'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Request, Response, NextFunction } from 'express'
import maxmind, { CityResponse, Reader } from 'maxmind'

import path from 'node:path'

export interface SessionData {
  ip: string
  country: string
  city: string
  lat: string
  lon: string
}

let lookup: Reader<CityResponse> | null = null

export function sessionMiddleware(db: NodePgDatabase) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Init Database lookup
        if (lookup === null) {
          const dir = path.join(process.cwd(), 'geo');
          lookup = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
        }

        const ip = req.ip as string

        const result = lookup.get('190.171.102.94')

        const session: SessionData = {
          ip,
          country: result?.country?.iso_code || 'US',
          city: result?.city?.names?.en || 'New York',
          lat: result?.location?.latitude?.toString() || '40.7128',
          lon: result?.location?.longitude?.toString() || '-74.0060'
        };

        (req as any).session = session
    
        next()
    }
}