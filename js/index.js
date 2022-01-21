
$("#auth_btn").on("click", function() {
    client_id = '4b7568883c5f41249cd4bb2d4fb30e86'
    
    let baseUrl = 'https://api.spotify.com/v1'
    let redirect_uri = 'https://ilyaguar.github.io/player/main_site';
    
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    
    $(document).ready ( function(){
        window.open(url, '_self');
    }); 
});