import { SessionService } from '@services/sessions.service'
import { detectOS, detectSoftware } from '@utils/origin-detect'
import { generateUUIDv5 } from '@utils/uuid'
import { Request, Response, NextFunction } from 'express'
import maxmind, { CityResponse, Reader } from 'maxmind'

export const NAMESPACE = '2b3dcd51-9ffb-409d-9168-d9b5dd2fecf2'

import path from 'node:path'

let lookup: Reader<CityResponse> | null = null

export function sessionMiddleware(service: SessionService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Init Database lookup
        if (lookup === null) {
          const dir = path.join(process.cwd(), 'geo');
          lookup = await maxmind.open(path.resolve(dir, 'GeoLite2-City.mmdb'));
        }

        // Get information from Request
        const user_agent = req.headers['user-agent'] as string
        const source_id = req.headers['source-id'] as string
        const ip = req.ip as string

        // Generate the UUID
        const uuid = generateUUIDv5([ip, source_id], NAMESPACE)

        // Check if the session exists
        let session = await service.find(uuid)

        // Create the session if it doesn't exist
        if (session === undefined) {
          // Get the IP information
          const result = lookup.get(ip)

          // Get os information
          const os = detectOS(user_agent)

          // Software information
          const software = detectSoftware(user_agent)

          session = await service.create({
            ip,
            uuid,
            os,
            software,
            country: result?.country?.iso_code || null,
            city: result?.city?.names?.en || null,
            lat: result?.location?.latitude?.toString() || null,
            lon: result?.location?.longitude?.toString() || null,
            source_id: parseInt(source_id)
          })
        };

        (req as any).session_id = session?.id
    
        next()
    }
}