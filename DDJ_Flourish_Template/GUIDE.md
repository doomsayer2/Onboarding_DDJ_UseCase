> Flourish Template - Usage

# Commands

## Run a template
```
flourish run [-o|--open] [--no-build] [--port=1685] [directory_name]
```

<br />

## Register account
```
flourish register
```

<br />

## Login to account
```
flourish login [email_address]
```

<br />

## Publish a template
```
flourish publish
```
Assuming you are logged in to your flourish account.

Options

- `--patch` – Increment the patch number before publishing. Useful for making a quick patch.
- `--prerelease` – Increment the prerelease tag before publishing. Useful for testing a template on the server.
- `--release` – Remove the prerelease tag before publishing.

<br />

## Delete a template
```
flourish delete [--force] template_id version
```
Assuming it has previously been published.

<br />
<br />

# Top-level structure
First, open `src/index.js`, and you'll see:
- the `data` object, that's where user-editable data tables will be stored
- the `state` object, which stores the visualization's current state
- the `draw()` function, which is called when the visualization loads
- the `update()` function, which gets called everytime the data or state changes

<br />

## File Structure
- template.yml
- template.js
- thumbnail.jpg or thumbnail.png
- index.html
- data/*.csv
- static/**

<br />

### `thumbnail.jpg` or `thumbnai.png`
A thumbnail image for the template, in JPEG or PNG format. No particular size is required. Recommended `600px × 400px`.

<br />

### `index.html`
To reference resources in the static directory use relative links, e.g.
```
<img src="logo.png">
```

<br />

### `data/*.csv`
Default data tables, referenced in the data: section of `template.yml`.

<br />

### `static/**`
Static files used in the template, such as images, fonts, stylesheets or code libraries. To reference the static directory in your index.html file, use relative links:
```html
<script src="leaflet/leaflet.js"></script>
```
Or from JavaScript use `Flourish.static_prefix`:
```javascript
const img_url = Flourish.static_prefix + "/my_image.jpg";
```

<br />

## The `template.yml` file
Take a look at the full reference at [https://developers.flourish.studio/sdk/api-reference/template-yml/](https://developers.flourish.studio/sdk/api-reference/template-yml/) for a detailed explanation.