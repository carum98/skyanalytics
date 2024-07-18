import { SessionService } from '@services/sessions.service'
import { Request, Response, NextFunction } from 'express'
import maxmind, { CityResponse, Reader } from 'maxmind'

import path from 'node:path'

let lookup: Reader<CityResponse> | null = null

export function sessionMiddleware(service: SessionService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Init Database lookup
        if (lookup === null) {
          const dir = path.join(process.cwd(), 'geo');
          lookup = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
        }

        const source_id = req.headers['source-id'] as string
        const ip = req.ip as string

        const result = lookup.get(ip)

        const session = {
          ip,
          country: result?.country?.iso_code || 'US',
          city: result?.city?.names?.en || 'New York',
          lat: result?.location?.latitude?.toString() || '40.7128',
          lon: result?.location?.longitude?.toString() || '-74.0060',
          source_id: parseInt(source_id)
        };

        const data = await service.create(session);
        (req as any).session_id = data?.id
    
        next()
    }
}