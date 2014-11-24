/*
 * ASHE SOCIAL FEED CLIENT- jQuery plugin for loading and scrolling through an ashe social feed
 */
(function($){

    $.fn.asheSocialFeed = function(url, options){

        var self            = this;
		var maxRank         = false;
		var working         = false;
		var highestRank     = 0;
		var data 			= {};
		var masonryInit     = false;
		var obj;
		var $cont;
		
        var defaults = {

            templateId     : 'ashe-social-feed-item',
			pollInt        : 0,
			token          : false,
			masonry        : false,
            updateOnScroll : false,
            //callbacks
            afterAdd : function() {}

        }
		
        var settings = $.extend({}, defaults, options);
		
		data['access_token'] = settings.token;
		data['callback'] 	 = '?';

		var tpl = _.template($('#' + settings.templateId).html());
		
        var init = function()
        {
	        getData();
            
            if (settings.updateOnScroll) {
			    setupScroll();
            }
            
			if(settings.pollInt != 0) {
				pollForUpdates();
            }
        };

		var getData = function()
		{
			
			working = true;
	        $.getJSON(url, data).done(function(response){
				
				if(response.posts.length > 0){
					obj                  = response.posts;
					data['max_rank']	 = response.last_rank;
//                        console.log(obj);
					if(highestRank == 0) {
						highestRank = obj[0].rank;
					}

					layoutPosts(obj);
				}
				
	        });
		};

		var layoutPosts = function(obj)
		{
			var newItems = [];
			$.each(obj, function(i, item){
				
				newItems.push($(tpl(item)));
			});
			
			var $newItems = $.map(newItems, function(el){return $.makeArray(el)});

			if(masonryInit && settings.masonry){
				self.append($newItems).imagesLoaded(function(){
					self.masonry('appended', $newItems);
				});
			}else{
				//console.log($newItems);
				self.append($newItems);
			}


			settings.afterAdd.call(this, self);

			if(!masonryInit && settings.masonry){

				$cont = self.masonry({
					itemSelector: '.card'
				});

				masonryInit = true;

				self.imagesLoaded(function() {
				  	$cont.masonry();
				});

			}
			working = false;
		};

		var setupScroll = function()
		{
			$(window).on('scroll', _.throttle(function(){

				if(isScrolledIntoView($('.card').last()) && !working) {
					getData();
				}

			}, 1000));
		};

		var pollForUpdates = function()
		{
			var polling = setInterval(function(){
				checkForNewContent();
			}, settings.pollInt);
		};

		var checkForNewContent = function(){

	        $.getJSON(url).done(function(response){
	        	$.each(response.data.cards, function(i, post){
	        		if(post.publish_time > highestRank){
	        			self.prepend(_.template(tpl, post));
						highestRank = post.rank;
						settings.afterAdd.call(this, self);
	        		}
	        	});
	        });

		};

		//utilities

        var isScrolledIntoView = function(elem)
        {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = elem.offset().top;
            var elemBottom = elemTop + elem.height();

            return (elemBottom <= docViewBottom);
        };
		
		//init plugin
		if(settings.token)
			init();
		else
			console.log('You Must Have an API Token!');

    }
})(jQuery);