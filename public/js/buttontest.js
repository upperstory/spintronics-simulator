const button = document.getElementById('generateLinkButton');
button.addEventListener('click', function(e) {
    console.log('button was clicked');

    /*fetch('/clicked', {method: 'POST'})
        .then(function(response) {
            if(response.ok) {
                console.log('Click was recorded');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });*/


});

function generateLink(encryptedCode)
{
    fetch('/generateLink', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({code: encryptedCode})
    })
    .then(function(response) {
        if(response.ok) {
            console.log('Click was recorded');
            return;
        }
        throw new Error('Request failed.');
    })
    .catch(function(error) {
        console.log(error);
    });
}