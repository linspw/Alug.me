var map, markers = { 'Apartamento': [], 'Casa': [], 'República': [], 'Pensão': [] }, geocoder
var infoWindows = { 'Apartamento': [], 'Casa': [], 'República': [], 'Pensão': [] }


// Funções de edição no Array
function addMarker(arrayDados, tipoMoradia) {
    let iconBase = './media/imgs/icons/'
    if (tipoMoradia == 'Apartamento') { var iconTheme = 'Apartamento.png' }
    if (tipoMoradia == 'Casa') { var iconTheme = 'Casa.png' }
    if (tipoMoradia == 'República') { var iconTheme = 'Republica.png' }
    if (tipoMoradia == 'Pensão') { var iconTheme = 'Pensao.png' }

    for (let i = 0; i < arrayDados.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(arrayDados[i][1], arrayDados[i][2]),
            title: arrayDados[i][0],
            icon: iconBase + iconTheme
        })
        markers[tipoMoradia].push(marker)
        var conteudo = '<div class="map-popup"><div class="map-popup"><span class="Razura4">' + arrayDados[i][0] +
            '</span></div><div class="map-popup-line"></div>' +
            '<div class="map-popup-text"><span class="Razura5">' + arrayDados[i][4] + '</span></div></div>'
        var infoWindow = new google.maps.InfoWindow({
            content: conteudo
        })
        infoWindows[tipoMoradia].push(infoWindow)
    }
}

function deleteMarker(arrayDados, tipoMoradia) {
    for (let i = 0; i < arrayDados.length; i++) {
        markers[tipoMoradia].splice()
    }
}
// Funções de Apresentação no mapa
function showAllMarker() {
    for (let i = 0; i < markers['Apartamento'].length; i++) {
        markers['Apartamento'][i].setMap(map)
    }
    for (let i = 0; i < markers['Casa'].length; i++) {
        markers['Casa'][i].setMap(map)
    }
    for (let i = 0; i < markers['República'].length; i++) {
        markers['República'][i].setMap(map)
    }
    for (let i = 0; i < markers['Pensão'].length; i++) {
        markers['Pensão'][i].setMap(map)
    }
}

function showMarker(tipoMoradia) {
    for (let i = 0; i < markers[tipoMoradia].length; i++) {
        markers[tipoMoradia][i].setMap(map)
        markers[tipoMoradia][i].addListener('click', function () {
            infoWindows[tipoMoradia][i].open(map, markers[tipoMoradia][i]);
        });
    }
    //console.log(markers)
    //console.log(infoWindows)
}
function removeMarker(tipoMoradia) {
    for (let i = 0; i < markers[tipoMoradia].length; i++) {
        markers[tipoMoradia][i].setMap(null)
    }
}
// Iniciar mapa com a Lista de array cheia
function inicializarMarcadores() {
    addMarker(markerApartamento, 'Apartamento')
    addMarker(markerCasa, 'Casa')
    addMarker(markerRepublia, 'República')
    addMarker(markerPensao, 'Pensão')
}
// Apresentar marcadores no mapa
function carregarMarcadores(a = 1, b = 1, c = 1, d = 1) {
    if (!a && !b && !c && !d) {
        removeMarker('Apartamento')
        removeMarker('Casa')
        removeMarker('República')
        removeMarker('Pensão')
    }
    else {
        //Apartamento
        if (a) {
            showMarker('Apartamento')
        }
        else {
            removeMarker('Apartamento')
        }
        //Casa
        if (b) {
            showMarker('Casa')
        }
        else {
            removeMarker('Casa')
        }
        //República
        if (c) {
            showMarker('República')
        }
        else {
            removeMarker('República')
        }
        //Pensão
        if (d) {
            showMarker('Pensão')
        }
        else {
            removeMarker('Pensão')
        }
    }
}
// Pesquisar por endereço 
function pesquisarAdicionarEndereco(endereco, num, tipoMoradia, tituloName) {
    geocoder.geocode({
        'address': endereco,
        componentRestrictions: {
            country: 'BR'
        },
        bounds: {
            north: -23.116795,
            east: -45.724563,
            south: -23.308354,
            west: -46.055684
        }
    },
        function (results, status) {
            if (status == 'OK') {
                addMarker([[tituloName, results[0].geometry.location.lat(), results[0].geometry.location.lng(), 1, num]], tipoMoradia)
                swal("Adicionado com sucesso!", "Seu endereço está no mapa!", "success");

                $('.interruptor-box').trigger('click')
                $('.interruptor-box').trigger('click')
            } else {
                alert('Geocode nao foi sucedido por causa: ' + status);
            }
        })
}

var markerApartamento = [
    ['Apartamento 4 dorm', -23.201498, -45.902723, 1, '1299000000', 'Autor'],
    ['Apartamento 2 dorm', -23.200471, -45.894007, 1, '1299000000', 'Autor'],
    ['Ap 50m para 4 pessoas', -23.201981, -45.894453, 1, '1299000000', 'Autor']
]
var markerCasa = [
    ['Casa 30m²', -23.199651, -45.895396, 2, '1299000000', 'Autor'],
    ['Casa 60m²', -23.203007, -45.894442, 2, '1299000000', 'Autor'],
    ['casa para 10 pessoas', -23.202948, -45.891985, 2, '1299000000', 'Autor']
]
var markerRepublia = [
    ['Rep Quinhentão', -23.191961, -45.887258, 3, '1299000000', 'Autor'],
    ['Rep Univap', -23.190916, -45.886496, 3, '1299000000', 'Autor'],
    ['REP CASTEJON', -23.194641, -45.888194, 3, '1299000000', 'Autor']
]
var markerPensao = [
    ['Pensao Noemi', -23.190542, -45.889426, 4, '1299000000', 'Autor'],
    ['Pensionato de meninas', -23.190848, -45.890874, 4, '1299000000', 'Autor'],
    ['Pensão para Homens', -23.189921, -45.887655, 4, '1299000000', 'Autor']
]
var markerHibrido = {
    Apartamento: [],
}

var estiloAplicado = [
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]


function inicializarMapa() {
    var mapOptions = {
        center: new google.maps.LatLng(-23.199651, -45.895396),
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: []
        },
        styles: estiloAplicado
    }
    map = new google.maps.Map(document.getElementById("canvas-map"), mapOptions)
    inicializarMarcadores()
    geocoder = new google.maps.Geocoder();
}