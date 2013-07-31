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

<table>
<tbody>
<tr>
<th>Key</th>
<th>Default</th>
<th>Descriptions</th>
</tr>
<tr>
<td>feedid</td>
<td>“LieNielsen”</td>
<td>Feed url/video ID. This is the only required parameter</td>
</tr>
<tr>
<td>maxresults</td>
<td>10</td>
<td>Number of results to show. 0 for no limit.</td>
</tr>
<tr>
<td>defaultvideo</td>
<td>‘none’</td>
<td>Sets the default video to display initially when more than one video is in the playlist. Uses the YouTube video id parameter.</td>
</tr>
<tr>
<td>displaytype</td>
<td>‘single’</td>
<td>Controls the display type. Can be set to “playlist”, “single”, or “user”</td>
</tr>
<tr>
<td>activeclass</td>
<td>‘active’</td>
<td>Sets the CSS class applied to the thumbnail div when it is the current video playing.</td>
</tr>
<tr>
<td>videowidth</td>
<td>450</td>
<td>Width of the displayed video.</td>
</tr>
<tr>
<td>videoheight</td>
<td>356</td>
<td>Height of the displayed video.</td>
</tr>
<tr>
<td>showthumbnails</td>
<td>true</td>
<td>Show or hide the playlist thumbnails.</td>
</tr>
<tr>
<td>showdescription</td>
<td>false</td>
<td>Show or hide the video description.</td>
</tr>
<tr>
<td>related</td>
<td>false</td>
<td>Show or hide related videos that appears after the video completes playing.</td>
</tr>
<tr>
<td>thumbpos</td>
<td>“after”</td>
<td>Arrange the thumbnails “before” or “after” the video display area.</td>
</tr>
</tbody>
</table>

### Upcoming Features

* Add templating system to allow for greater control over the generated HTML
* Add options for specifying the CSS classes applied to the thumbnails when active or inactive
* Add support for non-jQuery SWFObject display
