<!DOCTYPE html>
<html>
<head>
	<title>AsheSocialFeed jQuery plugin example</title>
	
	<link rel="stylesheet" href="style.css" >
	
	<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="js/underscore-min.js"></script>
	<script type="text/javascript" src="js/jquery-ashe-social-feed-client.js"></script>
	
	<script type="text/javascript">
	$(document).ready(function(){
		$('#feed ul').asheSocialFeed('http://social.asheavenue.com/api/v1/feeds/2',
			{
				token : 'fd140b2a1a1de41be2e47c44b36aeefb'
			}
		);
	});
	</script>
</head>

<body>
	<div class="wrapper">

		<h2>Ashe Social Feed Client Example</h2>

		<div id="feed">
		   	<ul>
			
		   	</ul>
		</div>

	</div>
	
	<script type="text/template" id="ashe-social-feed-item">
	
		<li id="post_<%= id %>" data-rank="<%= rank %>" class="<%= type %>">

			<div class="header">
				<div class="source"></div>
				<div class="date"></div>
			</div>

			<% if(media.length){ %>
			    <% $.each(media, function(i, medium){ %>
			        <img src="<%= medium.url %>">
			    <% }); %>
			 <% } %>

			<div class="title"><%= title %></div>

			<p><%= body %></p>
		</li>
	
	</script>
	
</body>
</html>