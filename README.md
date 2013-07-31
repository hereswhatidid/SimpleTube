SimpleTube
==========

Barebones jQuery plugin for displaying YouTube videos and feeds.

### Why use SimpleTube?

* Easy implementation to display playlists, search queries and single videos.
* Generates clean, basic HTML for the thumbnails and player. Thumbnails are just a basic set of divs.
* Written in jQuery plugin format and can be chained with other jQuery commands.
* Generates W3C valid XHTML and adds no JS global variables & passes JSLint.
* Released under the MIT License.

Tested In: Chrome, Firefox 3+, Safari 3+, Internet Explorer 7+.

### Instructions

The simpletube method takes a key/value object.

Format:

```
$('selector').simpletube({key:value, key:value, key:value});
```

Example:

```
$('#videoholder').simpletube({displaytype: 'single', feedid: 'xOfe1nwSCZU'});
```
   
Example:

```
$('#videoholder').simpletube( {
   displaytype: 'playlist',
   feedid: '7A970084B73399A8',
   activeclass: 'selectedclip'
} );
```

### Upcoming Features

* Add templating system to allow for greater control over the generated HTML
* Add options for specifying the CSS classes applied to the thumbnails when active or inactive
* Add support for non-jQuery SWFObject display
