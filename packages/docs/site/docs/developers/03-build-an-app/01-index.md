---
title: Quick Start Guide for Developers
slug: /developers/build-your-first-app
---

# Quick Start Guide for Developers

WordPress Playground was created as a programmable tool. Below you'll find a few examples of what you can do with it. Each discussed API is described in detail in the [APIs section](/developers/apis/):

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## Embed WordPress on your website

Playground can be embedded on your website using the HTML `<iframe>` tag as follows:

```html
<iframe src="https://playground.wordpress.net/"></iframe>
```

Every visitor will get their own private WordPress instance for free. You can then customize it using one of the [Playground APIs](/developers/apis/).

import PlaygroundWpNetWarning from '@site/docs/\_fragments/\_playground_wp_net_may_stop_working.md';

<PlaygroundWpNetWarning />

## Control the embedded website

WordPress Playground provides three APIs you can use to control the iframed website. All the examples in this section are built using one of these:

import APIList from '@site/docs/\_fragments/\_api_list.mdx';

<APIList />

Learn more about each of these APIs in the [APIs overview section](/developers/apis/).

## Showcase a plugin or theme from WordPress directory

import ThisIsQueryApi from '@site/docs/\_fragments/\_this_is_query_api.md';

You can install plugins and themes from the WordPress directory with only URL parameters. For example this iframe would come with the `coblocks` and `friends` plugins preinstalled as well as the `pendant` theme.

<ThisIsQueryApi />

```html
<iframe src="https://playground.wordpress.net/?plugin=coblocks"></iframe>
```

## Showcase any plugin or theme

Looking for plugins or themes to try?

Browse the official directories to discover plugin and theme and their slugs.

-   [WordPress Plugin Directory](https://wordpress.org/plugins/)
-   [WordPress Theme Directory](https://wordpress.org/themes/)

What if your plugin is not in the WordPress directory?

You can still showcase it on Playground by using [JSON Blueprints](/blueprints). For example, this Blueprint would download and install a plugin and a theme from your website and also import some starter content:

```json
{
	"steps": [
		{
			"step": "installPlugin",
			"pluginData": {
				"resource": "url",
				"url": "https://your-site.com/your-plugin.zip"
			}
		},
		{
			"step": "installTheme",
			"themeData": {
				"resource": "url",
				"url": "https://your-site.com/your-theme.zip"
			}
		},
		{
			"step": "importWxr",
			"pluginData": {
				"resource": "url",
				"url": "https://your-site.com/starter-content.wxr"
			}
		}
	]
}
```

See [getting started with Blueprints](/blueprints/getting-started) to learn more.

## Preview pull requests from your repository

See the [live example of Gutenberg PR previewer](https://playground.wordpress.net/gutenberg.html).

You can use Playground as a Pull Request previewer if:

-   Your WordPress plugin or theme uses a CI pipeline
-   Your CI pipeline bundles your plugin or theme
-   You can expose the zip file generated by your CI pipeline publicly

Those zip bundles aren't any different from regular WordPress Plugins, which means you can install them in Playground using the [JSON Blueprints](/blueprints) API. Once you exposed an endpoint like https://your-site.com/pull-request-1234.zip, the following Blueprint will do the rest:

```json
{
	"steps": [
		{
			"step": "installPlugin",
			"pluginData": {
				"resource": "url",
				"url": "https://your-site.com/pull-request-1234.zip"
			}
		}
	]
}
```

The official Playground demo uses this technique to preview pull requests from the Gutenberg repository:

import BlueprintExample from '@site/src/components/Blueprints/BlueprintExample.mdx';

<BlueprintExample
blueprint={{
	"landingPage": "/wp-admin/plugins.php?test=42test",
	"steps": [
		{
			"step": "login",
			"username": "admin",
			"password": "password"
		},
		{
			"step": "mkdir",
			"path": "/wordpress/pr"
		},
		{
			"step": "writeFile",
			"path": "/wordpress/pr/pr.zip",
			"data": {
				"resource": "url",
				"url": "/plugin-proxy.php?org=WordPress&repo=gutenberg&workflow=Build%20Gutenberg%20Plugin%20Zip&artifact=gutenberg-plugin&pr=60819",
				"caption": "Downloading Gutenberg PR 47739"
			},
			"progress": {
				"weight": 2,
				"caption": "Applying Gutenberg PR 47739"
			}
		},
		{
			"step": "unzip",
			"zipPath": "/wordpress/pr/pr.zip",
			"extractToPath": "/wordpress/pr"
		},
		{
			"step": "installPlugin",
			"pluginData": {
				"resource": "vfs",
				"path": "/wordpress/pr/gutenberg.zip"
			}
		}
	]
	}} />

## Build a compatibility testing environment

A live plugin demo with a configurable PHP and WordPress makes an excellent compatibility testing environment.

With the Query API, you'd simply add the `php` and `wp` query parameters to the URL:

```html
<iframe src="https://playground.wordpress.net/?php=7.4&wp=6.1"></iframe>
```

With JSON Blueprints, you'd use the `preferredVersions` property:

```json
{
	"preferredVersions": {
		"php": "7.4",
		"wp": "6.1"
	}
}
```

## Run PHP code in the browser

The JavaScript API provides the `run()` method which you can use to run PHP code in the browser:

```html
<iframe id="wp"></iframe>
<script type="module">
	const client = await startPlaygroundWeb({
		iframe: document.getElementById('wp'),
		remoteUrl: 'https://playground.wordpress.net/remote.html',
	});
	await client.isReady;
	await client.run({
		code: `<?php
		require("/wordpress/wp-load.php");

		update_option("blogname", "Playground is really cool!");
		echo "Site title updated!";
		`,
	});
	client.goTo('/');
</script>
```

Combine that with a code editor like Monaco or CodeMirror, and you'll get live code snippets like in [this article](https://adamadam.blog/2023/02/16/how-to-modify-html-in-a-php-wordpress-plugin-using-the-new-tag-processor-api/)!
