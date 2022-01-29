// import {Howl, Howler} from 'howler.core';

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
            console.log(res)
            $('#album_info')[0].children[0].innerText = res.name

            total = res.total

            i = 1 + offset;
            res.items.forEach(element => {
                let cover = element.track.album.images[0].url,
                    name = element.track.name;
                    artists = []
                    duration_sec = Math.floor((element.track.duration_ms)/1000)
                    duration = (Math.floor(duration_sec/60)) + ':' + new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2}).format(duration_sec%60);

                element.track.artists.forEach(element => {
                    artists.push(element.name)
                });

                artists = artists.join(', ')

                if (name.length > 30){
                    name = name.substring(0, 28)
                    name += '...'
                }

                let block = `
                    <div class="track">
                        <span>${i}</span>
                        <img src="${cover}" alt="cover">
                        <div class="track_info">
                            <span>${name}</span>
                            <br>
                            <span class="artists">${artists}</span>
                        </div>
                        <span>${duration}</span>
                    </div>
                `;
                $('.track_list').append(block);
                i = i + 1;
            });
        }
    }

    xhr.open('GET', r_link, false);
    
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    
    xhr.send();

    return(total)
}

/*----------------------------------------------------------------------------------------*/

$('#player').hide(),
$('#album_info').hide()

/*----------------------------------------------------------------------------------------*/
// if (data.howl) {
//     sound = data.howl;
// } 
// else {
//     let sound = new Howl({
//         src: ['audio/sound.mp3']
//     });
// }

// sound.play()

/*----------------------------------------------------------------------------------------*/

$('.miniPlayer').on('click', function() {
    $('.miniPlayer').hide()
    $('.transCover').show()
    $('#player').show()
    $('.meter').css('zoom', '150%')
    disableScroll()
});

$('.bigbtn').on('click', function() {
    $('.miniPlayer').show()
    $('.transCover').hide()
    $('#player').hide()
    $('#album_info').hide()
    $('.meter').css('zoom', '100%')
    enableScroll()
    $('.track').remove()
});

/*----------------------------------------------------------------------------------------*/

client_id = '4b7568883c5f41249cd4bb2d4fb30e86'
let baseUrl = 'https://api.spotify.com/v1'

let curURL = document.location.href;
let token = '';

i = 58;
while (i <= 216) {
    token += curURL[i];
    i++;
}

/*----------------------------------------------------------------------------------------*/

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
            i = i + 1;
        }
    }

    xhr.open('GET', r_link, false);
        
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
        
    xhr.send();
})

/*---Dev_process----------------------------------------------------------------------------*/

$('#submitSrch').on('click', function(){
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
                i = i + 1;
            }
        }

        xhr.open('GET', r_link, false);
            
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('Authorization', 'Bearer ' + token)
            
        xhr.send();
    })
})

/*----------------------------------------------------------------------------------------*/

$('.card').on('click', function(){
    disableScroll()
    $('.transCover').show()
    $('#album_info').show().css('overflow-y', 'auto')
    let album_id = $(this)[0].attributes[1].value
    let album_cover = $(this)[0].children[0].attributes[0].value

    $('#album_info')[0].children[1].attributes[0].value = album_cover

    let offset = 0
    
    while(true){
        let total = trackList(album_id, offset);
        
        if (total > 100){
            offset = offset + 100;
        }
        if (offset > total){
            break
        }
    }
})