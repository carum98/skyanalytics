const { currentScript } = document

if (!currentScript) {
  throw new Error('currentScript is not found')
}

const host = currentScript.getAttribute('data-host')
const key = currentScript.getAttribute('data-key')

if (!host || !key) {
	throw new Error('host or key is not found')
}

function send(payload) {
	fetch(`${host}/send`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-SkyAnalytics-Key': key || ''
		},
		body: JSON.stringify(payload)
	})
}

function handleDocumentReady(event) {
	if (event.target.readyState !== 'complete') return

	send({
		navigation: new URL(window.location.href).pathname,
	})
}

document.addEventListener('readystatechange', handleDocumentReady, true)