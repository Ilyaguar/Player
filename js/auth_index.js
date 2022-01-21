$('#player').hide(),
$('#album_info').hide()


$('.miniPlayer').on('click', function() {
    $('.miniPlayer').hide()
    $('.transCover').show()
    $('#player').show()
    $('.meter').css('zoom', '150%')
});

$('.bigbtn').on('click', function() {
    $('.miniPlayer').show()
    $('.transCover').hide()
    $('#player').hide()
    $('#album_info').hide()
    $('.meter').css('zoom', '100%')
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
    $('.transCover').show()
    $('#album_info').show()
    let album_id = $(this)[0].attributes[1].value

    var xhr = new XMLHttpRequest();
    let r_link = baseUrl + '/playlists/' + album_id;
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let res = xhr.responseText;
            res = JSON.parse(res)
            console.log(res)
            $('#album_info')[0].children[0].innerText = res.name
            $('#album_info')[0].children[1].attributes[0].value = res.images[0].url
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
