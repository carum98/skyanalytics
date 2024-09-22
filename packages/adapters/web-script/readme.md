# SkyAnalytics Web Script
SkyAnalytics Web Script is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics)

## Build
To build the project run the following command:
```bash
npm run build
```

## Usage
Copy and paste the code from `/dist/script.js` into the `<head>` of your website and set the `data-key` and `data-host` attributes in the script tag.

Example:
```html
<head>
	<script async data-key="" data-host="">
		// Code from /dist/script.js
	</script>
</head>
```

Or create a file with the code and include it in your website.
```html
<head>
	<script async src="path/to/script.js" data-key="" data-host=""></script>
</head>
```
