
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    // Show street view
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;
    $greeting.text('So, you want to live at ' + address + '?');
    var streeViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address;
    $body.append('<img class="bgimg" src="' + streeViewUrl + '">');

    // Show nytimes articles
    var nytimeUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + 
        '&sort=newest&api-key=05e7c6c6f4896fba6c08531808067326:10:67731177';
    $.getJSON(nytimeUrl).done(function(data) {
        $nytHeaderElem.text('New York Times Articles About ' + city);
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; ++i) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                '<a href="' + article.web_url +'">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>');
        }
    }).fail(function(e) {
        console.log('Fail');
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    // Show wiki links
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city +
        '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        // jsonp: "callback",
        success: function(response) {
            var articles = response[1];
            for (var i = 0; i < articles.length; ++i) {
                var article = articles[i];
                var url = 'http://en.wikipedia.org/wiki/' + article;
                $wikiElem.append('<li><a href="' + url + '">' + article + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
