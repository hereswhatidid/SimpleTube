(function($) {
	$.fn.simpletube = function(options) {
		var settings = $.extend({
			'feedid': 'LieNielsenToolworks', // feed url, only required parameters
			'startindex': 1,
			'maxresults': 10, // number of results to show, 0 for no limit
			'defaultvideo': 'none', // default video to display initially, uses the YouTube video id parameter
			'displaytype': 'single', // playlist, single, user
			'activeclass': 'active', // css class applied to the thumbnail div when it is the current video playing
			'videowidth': 450, // width of the displayed video
			'videoheight': 356, // height of the displayed video
			'showthumbnails': true, // show or hide thumbnails
			'showdescription': false, // show or hide video description
			'related': false, // show or hide related videos
			'templateid': '',
			'maintemplate': '<div class="videoholder"><div class="videooutput"><%=videoplayer%></div></div><div class="videothumbnails"><%=listitems%></div>',
			'maintemplatebefore': '<div class="videothumbnails"><%=listitems%></div><div class="videoholder"><div class="videooutput"><%=videoplayer%></div></div>',
			'listitemtemplate': '<div <%=videotrigger%>><img src="<%=thumbnailsrc%>" alt="<%=videotitle%>"><span class="thumbdescription"><%=videotitle%></span></div>',
			'thumbpos':'after', // arrange the thumbnails before or after video
			'onStart': null,
			'onLoadData': null,
			'onRender': null,
			'onLoadVideo': null,
			'onComplete': null
		}, options);
		if (settings.related === false) {
			settings.related = 1;
		} else {
			settings.related = 0;
		}

		var cache = {},
			output_template = '',
			methods = {};
		  
		methods._tmpl = function(str, data){
			var fn = !/\W/.test(str) ?
				cache[str] = cache[str] ||
					methods._tmpl(output_template) :
			new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			"with(obj){p.push('" +
			str
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'")
			+ "');}return p.join('');");
			return data ? fn( data ) : fn;
		};

		methods._createTemplate = function() {
			var main_template = '';
			if (settings.templateid === '') {
				if (settings.thumbpos === 'after') {
					main_template = settings.maintemplate;
				} else {
					main_template = settings.maintemplatebefore;
				}
			} else {
				main_template = document.getElementById(settings.templateid).innerHTML;
			}
			main_template = main_template.replace(/<%=videoplayer%>/,'<iframe width="<%=videowidth%>" height="<%=videoheight%>" src="http://www.youtube.com/embed/<%=defaultvideo%>" frameborder="0" allowfullscreen></iframe>');
			output_template = main_template.replace(/<%=listitems%>/g, '<% for ( var i = 0, max = videos.length; i < max; i++ ) { %>' + settings.listitemtemplate.replace(/<%=/g,'<%=videos[i].') + '<% } %>');
		}

		methods._trigger = function(event_name, callback, parameters) {
			$(document).trigger(event_name, parameters);
			if ($.isFunction(callback)) {
				callback.call(undefined, parameters);
			}
		}
		return this.each(function() {
			var $self = $(this),
				$events = $({}),
				outputdata = {},
				$videolinks = $({});
			methods._createTemplate();
			methods._trigger('st_start', settings.onStart, $self);
			switch(settings.displaytype) {
			case 'single':
				feed_url = 'https://gdata.youtube.com/feeds/api/videos/'+settings.feedid;
				break;
			case 'user':
				feed_url = 'https://gdata.youtube.com/feeds/api/users/' + settings.feedid + '/uploads';
				break;
			default:
				feed_url = 'https://gdata.youtube.com/feeds/api/playlists/'+settings.feedid;
				break;
			}
			$.ajax({
				dataType: 'jsonp',
				data: {
					'v': 2,
					'alt': 'jsonc',
					'start-index': settings.startindex,
					'max-results': settings.maxresults,
					'rel': settings.related
				},
				url: feed_url
			}).done(function(data, textStatus, jqXHR) {
				methods._trigger('st_loaddata', settings.onLoadData, data.data.items);
				outputdata = {
					'videowidth': settings.videowidth,
					'videoheight': settings.videoheight,
					'defaultvideo': (settings.defaultvideo !== 'none') ? settings.defaultvideo : data.data.items[0].id,
					'videos': []
				}
				$.each(data.data.items, function(index, item) {
					switch(settings.displaytype) {
					case 'single':
						outputdata.videos.push({
							'thumbnailsrc': item.thumbnail.hqDefault,
							'videotitle': item.title,
							'videodescription': item.description,
							'videoid': item.id,
							'videotrigger': ' data-videoid="' + item.id + '"'
						});
						break;
					case 'user':
						outputdata.videos.push({
							'thumbnailsrc': item.thumbnail.hqDefault,
							'videotitle': item.title,
							'videodescription': item.description,
							'videoid': item.id,
							'videotrigger': ' data-videoid="' + item.id + '"'
						});
						break;
					default:
						outputdata.defaultvideo = (settings.defaultvideo !== 'none') ? settings.defaultvideo : data.data.items[0].video.id;
						outputdata.videos.push({
							'thumbnailsrc': item.video.thumbnail.hqDefault,
							'videotitle': item.video.title,
							'videodescription': item.video.description,
							'videoid': item.video.id,
							'videotrigger': ' data-videoid="' + item.video.id + '"'
						});
						break;
					}

				});

				$self.html(methods._tmpl(settings.templateid, outputdata))
				methods._trigger('st_render', settings.onRender, $self);
				$videolinks = $self.find('[data-videoid]');
				$videolinks.find('[data-videoid="' + outputdata.defaultvideo + '"]').addClass(settings.activeclass);
				$self.on('click.simpletube', '[data-videoid]', function(e) {
					$videolinks.removeClass(settings.activeclass);
					$(this).addClass(settings.activeclass);
					methods._trigger('st_loadvideo', settings.onLoadVideo, $(this).data('videoid'));
					$('iframe', $self).attr('src', 'http://www.youtube.com/embed/' + $(this).data('videoid') + '?rel=' + settings.related);
				});
				methods._trigger('st_complete', settings.onComplete, $self);
			}).fail(function(data, textStatus, jqXHR) {
				$self.html('Error! - ' + textStatus);
			});
		});
	}
	$('.output').simpletube({
		'displaytype': 'user',
		'feedid': 'sweetbillypilgrim'
	});
})(jQuery);