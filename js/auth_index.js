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

function trackList(res, offset, list) {
    i = 1 + offset;
    let m_dir
    
    if (list[0] == $('#track_list')[0]){
         m_dir = res.items
    }
    else {
         m_dir = res.tracks.items
    }
    
    m_dir.forEach(element => {

        let dir, track_class

        if (list[0] == $('#track_list')[0]){
            dir = element.track
            track_class = 'playlist-track'
        }
        else {
            dir = element
            track_class = 'searchlist-track'
        }

        let cover = dir.album.images[0].url,
            name = dir.name;
            preview = dir.preview_url
            artists = []
            duration_sec = Math.floor((dir.duration_ms)/1000)
            duration = (Math.floor(duration_sec/60)) + ':' + new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2}).format(duration_sec%60);


        dir.artists.forEach(element => {
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

        let ex = `class='notExplicitL'`

        if (dir.explicit == true){
            console.log('explicit')
            ex = `class='explicitL'`
        }

        let block = `
            <div class="track ${track_class}">
                <span class='num'>${i}</span>
                <div class='intercover'>
                    <img src="${cover}" alt="cover" id="${preview}" class="track_cover">
                    <div class='pp_cover' style='display: none;'>
                        <img src='../img/play.png'>
                    </div>
                </div>
                <div class="track_info">
                    <span title-'${alt_name}'>${name}</span>
                    <br>
                    <span class="artists" title='${alt_artists}'>${artists}</span>
                </div>
                <div ${ex}>
                    <span>E</span>
                </div>
                <span>${duration}</span>
            </div>
        `;
        list.append(block);
        i = i + 1;
    });
};

function playlistTracks(album_id, offset) {
    let xhr = new XMLHttpRequest();
    let r_link = baseUrl + '/playlists/' + album_id + '/tracks?offset=' + offset;
    let total = 0
    let res
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {

            res = xhr.responseText;
            res = JSON.parse(res)

            total = res.total

            trackList(res, offset, $('#track_list'))

            if (total < offset + 100) {
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
    let audio = $('#audio'),
        pp = $(track)[0].children[1].children[1].children[0].attributes[0]

    audio[0].attributes[0].value = url
    if (url === 'null'){
        return(404)
    }
    else if (track.hasClass('play')) {
        track.removeClass('play')
        audio[0].pause()
        pp.value = "../img/play.png"

    }
    else {
        audio[0].play()
        arr = []
        $('.track').each(function() {
            arr.push($(this));
        });
        arr.forEach(element => {
            if (element.hasClass('play')) {
                element.removeClass('play')
                pp_div = $(element[0].children[1].children[1])
                pp_div.hide()
                
            }
        })
        track.addClass('play')
        pp.value = '../img/pause.png'
    }
    return(200)
}

/*----------------------------------------------------------------------------------------*/

client_id = '4b7568883c5f41249cd4bb2d4fb30e86'
let baseUrl = 'https://api.spotify.com/v1'

let curURL = document.location.href;
let token = '';

i = 0;
tkn = false
while (curURL[i] != '&') {      //Getting token
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
    $('.playlist-track').remove()
});


// track list forming
$('.card').on('click', function(){ 
    disableScroll()
    $('.transCover').show()
    $('.load').show()
    let album_id = $(this)[0].attributes[1].value
    let album_cover = $(this)[0].children[0].attributes[0].value

    $('#album_info')[0].children[1].attributes[0].value = album_cover
    $('#album_info')[0].children[0].innerText = $(this)[0].children[1].innerText
    
    setTimeout(() => {
        let offset = 0
        while(true){
            let total = playlistTracks(album_id, offset);
            offset = offset + 100;

            if (offset > total){
                break
            }
        }
    }, 100)
})

/*-----Mouse Interactions-----------------------------------------------------------------------------------*/


$(document).on('mouseenter', '.track', function(){
    if (($(this)).hasClass('play')){
        ($(this))[0].children[1].children[1].children[0].attributes[0].value = '../img/pause.png'
        $(($(this))[0].children[1].children[1]).show()
    }
    else{
        ($(this))[0].children[1].children[1].children[0].attributes[0].value = '../img/play.png'
        $(($(this))[0].children[1].children[1]).show()
    }
})

$(document).on('mouseleave', '.track', function(){
    if (!(($(this)).hasClass('play'))) {
        $(($(this))[0].children[1].children[1]).hide()
    }
})


/*-----html5 audio-----------------------------------------------------------------------------------*/

$(document).on('click', '.track', function(){
    let url = ($(this))[0].children[1].children[0].attributes[2].value
    
    let ans = play_pause(url, $(this))
    if (ans == 404){
        $(".alert").show().addClass('alert-anim')
        setTimeout(() => {
            $(".alert").removeClass('alert-anim')
        }, 500);
        setTimeout(() => {
            $(".alert").hide()
        }, 4000);
    }
})

/*----- Search -----------------------------------------------------------------------------------*/

$('#submitSrch').on('click', function(){
    q = $('#srchBar')[0].value

    let xhr = new XMLHttpRequest();
    let r_link = baseUrl + `/search?query=${q}&type=track&limit=50`;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let res = xhr.responseText;
            res = JSON.parse(res)

            if ($('#search_track_list')[0].children.length > 0) {
                $('.searchlist-track').remove()
            }
            trackList(res, 0, $('#search_track_list'))
            if($('.searchW').css('display') == 'none'){
                $('.searchW').show().addClass('s-window-anim')
                setTimeout(() => {
                    $('.searchW').removeClass('s-window-anim')
                }, 300);
            }
        }
    }

    xhr.open('GET', r_link, false);
        
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        
    xhr.send();
})

$('#minimise').on('click', function(){
    $('.searchW').addClass('s-window-anim-r')
    setTimeout(() => {
        $('.searchW').removeClass('s-window-anim-r').hide()
        $('.searchlist-track').remove()
    }, 300);
})