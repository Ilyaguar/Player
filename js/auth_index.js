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

$('.card').on('click', function(){
    disableScroll()
    $('.transCover').show()
    $('#album_info').show().css('overflow-y', 'auto')
    let album_id = $(this)[0].attributes[1].value

    var xhr = new XMLHttpRequest();
    let r_link = baseUrl + '/playlists/' + album_id;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {

            let res = xhr.responseText;
            res = JSON.parse(res)
            $('#album_info')[0].children[0].innerText = res.name
            $('#album_info')[0].children[1].attributes[0].value = res.images[0].url

            console.log(res.tracks.items)
            res.tracks.items.forEach(element => {
                let cover = element.track.album.images[0].url,
                    name = element.track.name;
                    artists = []
                    duration_sec = Math.floor((element.track.duration_ms)/1000)
                    duration = (Math.floor(duration_sec/60)) + ':' + new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2}).format(duration_sec%60);

                element.track.artists.forEach(element => {
                    artists.push(element.name)
                });

                artists = artists.join(', ')

                let block = `
                    <div class="track">
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
            });
        }
    }

    xhr.open('GET', r_link, true);
    
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    
    xhr.send();

})

// $('#pause').on('click', function() {
//     let trackid = '5hheGdf1cb4rK0FNiedCfK'
    
//     var xhr = new XMLHttpRequest();
//     let r_link = baseUrl + '/tracks/3NqBxTOMCJ3zW9CIP51td4';
//     let res = 'nope'

//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == XMLHttpRequest.DONE) {
//             res = xhr.responseText;
//         }
//     }
//     // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
//     xhr.open('GET', r_link, true);

//     xhr.setRequestHeader('Content-Type', 'application/json')
//     xhr.setRequestHeader('Authorization', 'Bearer ' + token)

//     $('#pause').attr('id', 'play')

//     // 3. Отсылаем запрос
//     xhr.send();
// });


// $('#prev').on('click', function() { 
//     var xhr = new XMLHttpRequest();
//     let r_link = baseUrl + '/me/player/shuffle';

//     // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
//     xhr.open('PUT', r_link, true);

//     xhr.setRequestHeader('Authorization', 'Bearer ' + token);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     // 3. Отсылаем запрос
//     xhr.send();
// });


// $('#play').on('click', function() {
//     let trackid = '5hheGdf1cb4rK0FNiedCfK'
    
//     var xhr = new XMLHttpRequest();
//     let r_link = baseUrl + '/me/player/pause';

//     // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
//     xhr.open('PUT', r_link, true);

//     xhr.setRequestHeader('Content-Type', 'application/json')
//     xhr.setRequestHeader('Authorization', 'Bearer ' + token)

//     $('#play').attr('id', 'pause')
    
//     // 3. Отсылаем запрос
//     xhr.send();
// });
