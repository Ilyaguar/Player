function disableScroll() {
    // Получить текущую позицию прокрутки страницы
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        // при попытке прокрутки установить это значение на предыдущее
        window.onscroll = function() {
            window.scrollTo(scrollLeft, scrollTop);
        };
}

function enableScroll() {
    window.onscroll = function() {};
}

function trackList(album_id, offset) {
    let xhr = new XMLHttpRequest();
    let r_link = baseUrl + '/playlists/' + album_id + '/tracks?offset=' + offset;
    let total = 0
    let res
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {

            res = xhr.responseText;
            res = JSON.parse(res)

            total = res.total

            i = 1 + offset;
            res.items.forEach(element => {
                let cover = element.track.album.images[0].url,
                    name = element.track.name;
                    preview = element.track.preview_url
                    artists = []
                    duration_sec = Math.floor((element.track.duration_ms)/1000)
                    duration = (Math.floor(duration_sec/60)) + ':' + new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2}).format(duration_sec%60);


                element.track.artists.forEach(element => {
                    artists.push(element.name)
                });

                artists = artists.join(', ')

                let alt_name = '',
                    alt_artists = '';

                if (name.length > 40){
                    alt_name = name
                    name = name.substring(0, 35)
                    name += '...'
                }

                if (artists.length > 55){
                    alt_artists = artists
                    artists = artists.substring(0, 55)
                    artists += '...'
                }

                let block = `
                    <div class="track">
                        <span>${i}</span>
                        <div>
                            <img src="${cover}" alt="cover" id="${preview}" class="track_cover">
                            <div class='pp_cover'>
                                <img href='img/play-button-arrowhead.png'>
                            </div>
                        </div>
                        <div class="track_info">
                            <span title-'${alt_name}'>${name}</span>
                            <br>
                            <span class="artists" title='${alt_artists}'>${artists}</span>
                        </div>
                        <span>${duration}</span>
                    </div>
                `;
                $('.track_list').append(block);
                i = i + 1;
            });

            if (total < offset + 100) {
                console.log('hide')
                $('.load').hide()
                $('#album_info').show().css('overflow-y', 'auto').css('display', 'flex')
            }
        }
    }

    xhr.open('GET', r_link, false);
    
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    
    xhr.send();

    return(total)
}

function play_pause(url, track){
    let audio = $('#audio')

    audio[0].attributes[0].value = url
    if (url === 'null'){
        return(404)
    }
    else if (track.hasClass('play')) {
        track.removeClass('play')
        audio[0].pause()
    }
    else {
        audio[0].play()
        arr = []
        $('.track_cover').each(function() {
            arr.push($(this));
        });
        arr.forEach(element => {
            if (element.hasClass('play')) {
                element.removeClass('play')
            }
        })
        track.addClass('play')
    }
    return(200)
}

/*----------------------------------------------------------------------------------------*/

//$('#player').hide(),

/*----------------------------------------------------------------------------------------*/

client_id = '4b7568883c5f41249cd4bb2d4fb30e86'
let baseUrl = 'https://api.spotify.com/v1'

let curURL = document.location.href;
let token = '';

i = 0;
tkn = false
while (curURL[i] != '&') {
    if(tkn){
        token += curURL[i];
    }
    if (curURL[i] == '='){
        tkn = true
    }
    i++;
}

/*----- Pre-Load Covers ---------------------------------------------------------------------------------*/

let cards = Array.from($('.card'))
let card_covers = Array.from($('.card_cover'))

i = 0;
cards.forEach(element => {
    let xhr = new XMLHttpRequest();
    let r_link = baseUrl + '/playlists/' + element.id;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let res = xhr.responseText;
            res = JSON.parse(res)
            card_covers[i].src = res.images[0].url
            $(cards[i])[0].children[1].innerText = res.name
            i = i + 1;
        }
    }

    xhr.open('GET', r_link, false);
        
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        
    xhr.send();
})

$('.load').hide()
$('.transCover').hide()

/*----------------------------------------------------------------------------------------*/

$('.bigbtn').on('click', function() {
    $('.transCover').hide()
    $('#album_info').hide()
    enableScroll()
    $('.track').remove()
});


// track list forming
$('.card').on('click', function(){ 
    disableScroll()
    $('.transCover').show()
    $('.load').show()
    console.log('show')
    let album_id = $(this)[0].attributes[1].value
    let album_cover = $(this)[0].children[0].attributes[0].value

    $('#album_info')[0].children[1].attributes[0].value = album_cover
    $('#album_info')[0].children[0].innerText = $(this)[0].children[1].innerText
    
    let offset = 0
    while(true){
        let total = trackList(album_id, offset);
        offset = offset + 100;

        if (offset > total){
            break
        }
    }
})

$(document).on('mousemove', '.track', function(){
    if (($(this))[0].hasClass('play')){
        console.log(($(this))[0].children[1].children[1].children[0].attributes)
    }
    else{
        
    }
})


/*-----html5 audio-----------------------------------------------------------------------------------*/

$(document).on('click', '.track', function(){
    let url = ($(this))[0].children[1].children[0].attributes[2].value
    
    let ans = play_pause(url, $(this))
    if (ans == 404){
        $(".alert").addClass('alert-anim').show()
        setTimeout(() => {
            $(".alert").removeClass('alert-anim')
        }, 500);
        setTimeout(() => {
            $(".alert").hide()
        }, 4000);
    }
})