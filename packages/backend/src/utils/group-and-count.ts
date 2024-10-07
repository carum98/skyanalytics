// This function groups the data by a key and counts the number of occurrences
// if the key is null, it will be replaced by 'Unknown'
export function groupByAndCount(data: any[], path: string) {
    return Object.fromEntries(Object.entries(Object.groupBy(
        data, 
        (item) => getValue(item, path)
    ))
    .map(([key, value]) => [
        key === 'null' ? 'Unknown' : key, 
        value?.length || 0
    ]))
}

function getValue(item: any, path: string) {
	const keys = path.split('.')

	return keys.reduce((acc, key) => acc[key], item) as string
}