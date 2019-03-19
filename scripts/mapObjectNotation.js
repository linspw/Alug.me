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
        //console.log("controlador Criado")
        this.historicoSearch = []
    }
    confereEntrada(titulo, autor, descricao, telefone, endereco){
        //console.log(typeof titulo, typeof autor, typeof descricao, typeof telefone, typeof endereco)
        if(typeof titulo != "string" && typeof autor!= "string" && typeof descricao != "string" && typeof telefone != "string" && typeof endereco != "string"){
            console.log("Erro - Um dos valores dados não é String")
            return 0
        } else if(titulo.length > 25 && autor.length > 40 && descricao.length > 25 && telefone.length > 12 && endereco.length > 100){
            console.log("Erro - Um dos campos possui tamanho maior do que o recomendado")
            return 0
        }
        else {
            console.log("Ativado")
            return 1
        }
    }
    pesquisarEndereco(endereco, focus, callback){
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
                //console.log("Work!", results[0])
                if(callback){callback(results[0])}
                
            } else {
                alert('Geocode nao foi sucedido por causa: ' + status);
            }
            
        })       
    }
    processoAdicionar(titulo, autor, descricao, telefone, endereco, focus){
        const manipulaData = (data) => {
            this.historicoSearch.push(data)
            console.log("Resultado:", this.historicoSearch)
            
        }
        if(this.confereEntrada(titulo, autor, descricao, telefone, endereco)){
            this.pesquisarEndereco(endereco, focus, manipulaData)
        }
        else{
            console.log("Não funcional!")
        }
    }
}


class Mapa {
    constructor() {
        this.lugares = []
        this.menuAtivado = [true, true, true, true, true]
        this.estilo = [{"featureType": "poi","elementType": "labels.text","stylers": [{"visibility": "off"}]},{"featureType": "poi.business",
                "stylers": [{"visibility": "off"}]},{"featureType": "road","elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]},{"featureType": "transit",
                "stylers": [{"visibility": "off"}]}]
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

    }

    adicionarLugares(...local) {
        local.forEach((l) => { this.lugares.push(l) })
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
    showByType(valor) {
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

    reload(){
        this.showByType(this.menuAtivado)
    }
}

class Lugar {
    constructor(ID, Location, title, text, typePLace = 0, celphone=null, andress=null) {
        this.ID = ID
        this.Location = { lat: Location[0], lng: Location[1] }
        
        this.andress = andress

        let iconBase = './media/imgs/icons/'
        if(typePLace==1){iconBase += 'Apartamento.png'}
        if(typePLace==2){iconBase += 'Casa.png'}
        if(typePLace==3){iconBase += 'Republica.png'}
        if(typePLace==4){iconBase += 'Pensao.png'}
        this.typePLace = typePLace
        this.celphone = celphone
        this.title = title
        this.marker = new google.maps.Marker({
            position: { lat: Location[0], lng: Location[1] },
            title: title,
            icon: iconBase
        })
        let InfoWindow = '<div class="map-popup"><div class="map-popup-title">'
        +'<span class="Razura4">' + 
        title + '</span></div><div class="map-popup-line"></div>' +
        '<div class="map-popup-text"><span class="Razura5">' + 
        text + '</span></div></div>'

        this.InfoWindow = new google.maps.InfoWindow({
            content: InfoWindow
        })
        
    }
}

const local1 = new Lugar(01, [-23.201498, -45.902723], 'Info 1', 'OK', 1, '12996277432')
const local2 = new Lugar(02, [-23.199651, -45.895396], 'Info 2', 'NopK', 2, '12829229')
const local3 = new Lugar(03, [-23.191961, -45.887258], 'Info 3', 'Yapek', 3, '099292')
const local4 = new Lugar(04, [-23.190542, -45.889426], 'Info 4', 'JUP', 4, '022')
const local5 = new Lugar(05, [-23.201981, -45.894453], 'Info 5', 'LOMPA', 0 ,'321312')
//console.log(local5)


const map1 = new Mapa()
let listaAdicional = [local1, local2, local5]
map1.adicionarLugares(...listaAdicional) // funcionou também
map1.adicionarLugares(local3, local4)
const controlSystem = new Controlador()

