jQuery.event.special.touchstart = {
    setup: function (_, ns, handle) {
        if (ns.includes("noPreventDefault")) {
            this.addEventListener("touchstart", handle, { passive: false });
        } else {
            this.addEventListener("touchstart", handle, { passive: true });
        }
    }
}

class Controlador {
    constructor() {
        this.historicoSearch = []
    }
    confereEntrada(titulo, autor, descricao, telefone, endereco) {
        if (typeof titulo != "string" && typeof autor != "string" && typeof descricao != "string" && typeof telefone != "string" && typeof endereco != "string") {
            console.log("Erro - Um dos valores dados não é String")
            return 0
        } else if (titulo.length > 25 && autor.length > 40 && descricao.length > 25 && telefone.length > 12 && endereco.length > 100) {
            console.log("Erro - Um dos campos possui tamanho maior do que o recomendado")
            return 0
        }
        else {
            return 1
        }
    }
    pesquisarEndereco(endereco, focus, callback) {
        focus.geocoder.geocode({
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
                    if (callback) { callback(results[0]) }

                } else {
                    alert('Geocode nao foi sucedido por causa: ' + status);
                }

            })
    }
    processoAdicionar(titulo, autor, descricao, telefone, endereco, focus, tipoMoradia = 0) {
        const adicionarLugar = (data) => { //Metodo para dar funcionalidade ao processo de adicionar
            this.historicoSearch.push(data)
            swal({
                title: "Você confirma a posição?",
                text: "Uma vez confirmado iremos adicionar no mapa.",
                icon: "info",
                buttons: ["Cancelar", "Aceitar"],
                dangerMode: true,
            }).then((btAtivado) => {
                if (btAtivado) {
                    map1.adicionarLugares(new Lugar(map1.lugares.length + 1, [data.geometry.location.lat(), data.geometry.location.lng()], titulo, autor, tipoMoradia, telefone))
                    swal({ title: "Lugar Adicionado!", text: "Conteudo adicionado parabéns!", icon: "success" })
                    controlSystem.cleanDataInput()
                    $('#btn-anunciar').click()
                }
            })
        }
        if (this.confereEntrada(titulo, autor, descricao, telefone, endereco)) {
            this.pesquisarEndereco(endereco, focus, adicionarLugar)
        }
        else {
            console.log("Não funcional!")
        }
    }
    cleanDataInput() {
        $('#txt-titulo').val("")
        $('#txt-autor').val("")
        $('#txt-endereco').val("")
        $('#txt-descricao').val("")
        $('#txt-telefone').val("")
        $("#check-endereco").fadeOut()
    }
}


class Mapa {
    constructor() {
        this.lugares = []
        this.menuAtivado = [true, true, true, true, true]
        this.estilo = [{ "featureType": "poi", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, {
            "featureType": "poi.business",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "road", "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        }, {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }]
        }]
        this.mapOptions = {
            center: new google.maps.LatLng(-23.199651, -45.895396),
            zoom: 15,
            mapTypeControlOptions: {
                mapTypeIds: []
            },
            streetViewControl: false,
            styles: this.estilo
        }
        this.canvasMap = new google.maps.Map(document.getElementById("canvas-map"), this.mapOptions)
        this.rectangle = new google.maps.Rectangle({
            strokeColor: '#53c6e5',
            strokeOpacity: 0.9,
            strokeWeight: 5,
            fillColor: '#53c6e5',
            fillOpacity: 0,
            map: this.canvasMap,
            bounds: {
                north: -23.116795,
                east: -45.724563,
                south: -23.308354,
                west: -46.055684
            }
        })
        this.geocoder = new google.maps.Geocoder()
        this.searchBox = new google.maps.places.SearchBox(document.getElementById("txt-endereco"), {
            bounds: {
                north: -23.116795,
                east: -45.724563,
                south: -23.308354,
                west: -46.055684
            }
        })
        this.temporalMarker = new google.maps.Marker()
    }

    adicionarLugares(...local) {
        local.forEach((l) => { this.lugares.push(l) })
        this.reload()
    }

    removerLugares(ID = false, typePlaces = false) {
        if (ID) {
            this.lugares = this.lugares.filter((e, i) => {
                return e.ID !== ID
            })
        } else if (typePlaces) {
            this.lugares = this.lugares.filter((e, i) => {
                return e.typePLace !== typePlaces
            })
        } else {
            this.lugares = []
        }
    }
    marcarTemporario(lat, lng, title = "Seu anuncio") {
        this.temporalMarker.setMap(null)
        var iconBase = {
            url: "./media/imgs/icons/home-icon.png",
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
        }
        var infoWindow = new google.maps.InfoWindow({
            content: '<div>Seu marcador!</div>'
        })
        this.temporalMarker = new google.maps.Marker({
            position: { lat, lng },
            title: title,
            icon: iconBase
        })
        this.temporalMarker.setMap(this.canvasMap)
        infoWindow.open(this.map, this.temporalMarker)
        this.temporalMarker.addListener('click', function () {
            infoWindow.open(this.map, this.temporalMarker)
        })
    }
    removerTemporario() {
        this.temporalMarker.setMap(null)
    }
    mostrarPorTipo(valor) {
        this.menuAtivado = valor
        this.lugares.forEach((e) => {
            if (this.menuAtivado[0] && e.typePLace == 0) {
                e.marker.setMap(this.canvasMap)
                e.marker.addListener('click', function () {
                    e.InfoWindow.open(this.map, e.marker)
                })
            } else if (this.menuAtivado[1] && e.typePLace == 1) {
                e.marker.setMap(this.canvasMap)
                e.marker.addListener('click', function () {
                    e.InfoWindow.open(this.map, e.marker)
                })
            } else if (this.menuAtivado[2] && e.typePLace == 2) {
                e.marker.setMap(this.canvasMap)
                e.marker.addListener('click', function () {
                    e.InfoWindow.open(this.map, e.marker)
                })
            } else if (this.menuAtivado[3] && e.typePLace == 3) {
                e.marker.setMap(this.canvasMap)
                e.marker.addListener('click', function () {
                    e.InfoWindow.open(this.map, e.marker)
                })
            } else if (this.menuAtivado[4] && e.typePLace == 4) {
                e.marker.setMap(this.canvasMap)
                e.marker.addListener('click', function () {
                    e.InfoWindow.open(this.map, e.marker)
                })
            } else {
                e.marker.setMap(null)
            }
        }
        )
    }

    reload() {
        this.temporalMarker.setMap(null)
        this.mostrarPorTipo(this.menuAtivado)
    }
}

class Lugar {
    constructor(ID, Location, title, text, typePLace = 0, celphone = null, andress = null) {
        this.ID = ID
        this.Location = { lat: Location[0], lng: Location[1] }

        this.andress = andress

        let iconBase = './media/imgs/icons/'
        if (typePLace == 1) { iconBase += 'Apartamento.png' }
        if (typePLace == 2) { iconBase += 'Casa.png' }
        if (typePLace == 3) { iconBase += 'Republica.png' }
        if (typePLace == 4) { iconBase += 'Pensao.png' }
        this.typePLace = typePLace
        this.celphone = celphone
        this.title = title
        this.text = text
        this.marker = new google.maps.Marker({
            position: { lat: Location[0], lng: Location[1] },
            title: title,
            icon: iconBase
        })
        let InfoWindow = '<div class="map-popup"><div class="map-popup-title">'
            + '<span class="Razura4">' +
            title + '</span></div><div class="map-popup-line"></div>' +
            '<div class="map-popup-text"><span class="Razura5">' +
            text + '</span></div></div>'

        this.InfoWindow = new google.maps.InfoWindow({
            content: InfoWindow
        })

    }
}

const local1 = new Lugar(01, [-23.201498, -45.902723], 'Info para teste 1', 'Exemplo 1', 1, '12996277432', 'Avenida São João')
const local2 = new Lugar(02, [-23.199651, -45.895396], 'Info para teste 2', 'Exemplo 2', 2, '12829229', 'Avenida 9 de Julho')
const local3 = new Lugar(03, [-23.191961, -45.887258], 'Info para teste 3', 'Exemplo 3', 3, '099292', 'Rua Euclídes Miragaia')
const local4 = new Lugar(04, [-23.190542, -45.889426], 'Info para teste 4', 'Exemplo 4', 4, '022', 'Rua Major Antonio Domingues')
const local5 = new Lugar(05, [-23.201981, -45.894453], 'Info para teste 5', 'Exemplo 5', 1, '321312', 'Praça do Sol - Vila Adyana')

const map1 = new Mapa()
let listaAdicional = [local1, local2, local3, local4, local5]
map1.adicionarLugares(...listaAdicional) // Adicionar em forma de lista!
//map1.adicionarLugares(local3, local4) // Adicionar Diretamente
const controlSystem = new Controlador()

