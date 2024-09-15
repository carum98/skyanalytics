export const systemOperative = ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'] as const

type OS_ENUM = typeof systemOperative[number]

const operatingSystemRules: [OS_ENUM, RegExp][] = [
    ['Windows', /(Windows)/],
    ['MacOS', /(Mac_PowerPC)|(Macintosh)/],
    ['Linux', /(Linux)|(X11)/],
    ['iOS', /iP(hone|od|ad)|ios/],
    ['Android', /Android|android/],
]

export function detectOS(userAgent: string) {
    for (const [os, rule] of operatingSystemRules) {
        if (rule.test(userAgent)) {
            return os
        }
    }

    return null
}

const softwareRules: [string, RegExp][] = [
    ['edge', /Edg\/([0-9\._]+)/],
    ['samsung', /SamsungBrowser\/([0-9\.]+)/],
    ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
    ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
    ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
    ['android', /Android\s([0-9\.]+)/],
    ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
    ['safari', /Version\/([0-9\._]+).*Safari/],
    ['dart', /Dart\/([0-9\.]+)/],
]

export function detectSoftware(userAgent: string) {
    for (const [software, rule] of softwareRules) {
        const match = userAgent.match(rule)
        if (match) {
            let version = match[1]
            return software + (version ? `_${version}` : '')
        }
    }

    return null
}