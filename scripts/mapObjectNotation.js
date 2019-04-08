class Controlador {
    constructor() {
        this.historicoSearch = []
        this.txt_A_titulo = $('#txt-titulo')
        this.txt_A_autor = $('#txt-autor')
        this.txt_A_endereco = $('#txt-endereco')
        this.txt_A_descricao = $('#txt-descricao')
        this.txt_A_telefone = $('#txt-telefone')
        this.check_A_endereco = $("#check-endereco")
        this.btn_A_anunciar = $('#btn-anunciar')
        this.window = $(window)
        this.tooltipMenuAlugarSJC = $('#tpt-MM-alugasjc')
        this.tooltipMenuLogo = $('#tpt-MM-logo')
        this.tooltipMenuAnunciar = $('#tpt-MM-anunciar')
        this.tooltipMenuLogin = $('#tpt-MM-login')

    }
    verifyIsMobile(){
        if (this.window.width() <= 899) {
            console.log("É mobile")
            return true
        }
        if (this.window.width() > 899) {
            console.log("É Desktop")
            return false
        }
    }
    verifyAnunciarSlots(){
        if((this.txt_A_titulo.val() == "") || this.txt_A_titulo.val().length > 25){
            swal("Opa!", "O título não foi preenchido!", "error" )
            return
        }
        if((this.txt_A_autor.val() == "") || this.txt_A_autor.val().length > 25){
            swal("Opa!", "Algum campo não foi preenchido!", "error" )
            return
        }
        if(this.txt_A_endereco.val() == ""){
            swal("Opa!", "Algum campo não foi preenchido!", "error" )
            return
        }
        if((this.txt_A_descricao.val() == "") || this.txt_A_descricao.val().length > 50){
            swal("Opa!", "Algum campo não foi preenchido!", "error" )
            return
        }
        if((this.txt_A_telefone.val() == "") || this.txt_A_telefone.val().length > 13){
            swal("Opa!", "Algum campo não foi preenchido!", "error" )
            return
        }
        else{
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
                    mapSystem.adicionarLugares(new Lugar(mapSystem.lugares.length + 1, [data.geometry.location.lat(), data.geometry.location.lng()], titulo, descricao, tipoMoradia, telefone, endereco, autor))
                    swal({ title: "Lugar Adicionado!", text: "Conteudo adicionado parabéns!", icon: "success" })
                    controlSystem.cleanDataInput()
                    this.btn_A_anunciar.click()
                }
            })
        }
        this.pesquisarEndereco(endereco, focus, adicionarLugar)
    }
    cleanDataInput() {
        this.txt_A_titulo.val("")
        this.txt_A_autor.val("")
        this.txt_A_endereco.val("")
        this.txt_A_descricao.val("")
        this.txt_A_telefone.val("")
        this.check_A_endereco.fadeOut()
    }
    loadTooltip(element, type){
        if(type == 1){
            if(element.hasClass('hovertooltip')){
                element.removeClass('hovertooltip')
                element.attr('style','');
            }
            element.addClass("normaltooltip")
            element.append( "<button class='tooltip-closebtn'>X</button>")
        } else if(type == 2){
            if(element.hasClass('normaltooltip')){
                element.children('button.tooltip-closebtn').remove('button.tooltip-closebtn')
                element.removeClass('normaltooltip')
                element.attr('style','');
            }
            element.addClass("hovertooltip")
        }
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
    constructor(ID, location, title, text, typePLace = 0, celphone = null, andress = null, autor=null) {
        this.ID = ID
        this.location = { lat: location[0], lng: location[1] }
        this.title = title
        this.text = text
        this.typePLace = typePLace
        this.celphone = celphone
        this.andress = andress
        this.autor = autor

        let iconBase = './media/imgs/icons/'
        if (typePLace == 1) { iconBase += 'Apartamento.png' }
        if (typePLace == 2) { iconBase += 'Casa.png' }
        if (typePLace == 3) { iconBase += 'Republica.png' }
        if (typePLace == 4) { iconBase += 'Pensao.png' }
        this.marker = new google.maps.Marker({
            position: { lat: location[0], lng: location[1] },
            title: title,
            icon: iconBase
        })
        let InfoWindowCanvas = '<div class="map-popup"><div class="map-popup-title">'
            + '<span class="Razura4">' +
            title + '</span></div><div class="map-popup-line"></div>' +
            '<div class="map-popup-text"><span class="Razura5">' +
            text + '</span></div><div class="map-popup-block"><div class="map-popup-autor"><span class="Razura8">Autor: '+ autor 
            +'</span></div><div class="map-popup-celphone"><span class="Razura6">Celular: ' + celphone +
             '</span></div><div class="map-popup-andress"><span class="Razura7">Endereço: ' +
             andress +'</span></div></div></div>'

        this.InfoWindow = new google.maps.InfoWindow({
            content: InfoWindowCanvas
        })

    }
}

const local1 = new Lugar(01, [-23.201498, -45.902723], 'Exemplo 1', 'Info para teste 1',  1, '12996277432', 'Avenida São João', 'Jessé')
const local2 = new Lugar(02, [-23.199651, -45.895396], 'Exemplo 2', 'Info para teste 2', 2, '128292329', 'Avenida 9 de Julho', 'Guilherme')
const local3 = new Lugar(03, [-23.191961, -45.887258], 'Exemplo 3', 'Info para teste 3',  3, '12923099292', 'Rua Euclídes Miragaia', 'Davi')
const local4 = new Lugar(04, [-23.190542, -45.889426], 'Exemplo 4', 'Info para teste 4',  4, '022192929', 'Rua Major Antonio Domingues', 'Gabriel')
const local5 = new Lugar(05, [-23.201981, -45.894453], 'Exemplo 5', 'Info para teste 5', 1, '3213123211', 'Praça do Sol - Vila Adyana', 'David')

const mapSystem = new Mapa()
let listaAdicional = [local1, local2, local3, local4, local5]
mapSystem.adicionarLugares(...listaAdicional) // Adicionar em forma de lista!
const controlSystem = new Controlador()

