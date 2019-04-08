$('button#logo').click(function(){
    location.reload(true)
})
$('#btn-anunciar').click(function(){
    if($('.menu-side-right').hasClass('active')){
        $("#mn-sr").fadeOut(500)
        $(".menu-wrapper").fadeOut(0)
        document.getElementById("mn-sr").style.width = "0em"
        if(controlSystem.verifyIsMobile() && $('.mobile-menu').hasClass("active")){
            $('.mobile-menu').click()
        }
    }
    else{
        $("#mn-sr").css("display", "flex").hide().fadeIn(500)
        $(".menu-wrapper").css("display", "flex").hide().fadeIn(500)
        document.getElementById("mn-sr").style.width = "20em"
        if(controlSystem.verifyIsMobile()){
            $('.mobile-menu').click()
        }
    }
    $('.menu-side-right').toggleClass('active')
})

$('#btn-painel-maps').click(function(){
    if($(this).hasClass('active')){
        document.getElementById("painel-maps").style.width = "3em"
        document.getElementById("painel-maps").style.height = "3em"
        $("#icon-painel-map").css({'transform': 'rotate(0deg)'})
        $(".painel-maps-wrapper").fadeOut(500)
    }
    else{
        document.getElementById("painel-maps").style.width = "18em"
        document.getElementById("painel-maps").style.height = "13em"
        $("#icon-painel-map").css({'transform': 'rotate(-90deg)'})
        $(".painel-maps-wrapper").fadeIn(500)

    }
    $(this).toggleClass('active')
})

$('#btn-anunciar-enviar').click(function(){
    if(controlSystem.verifyAnunciarSlots()){
        controlSystem.processoAdicionar($('#txt-titulo').val(), $('#txt-autor').val(), $('#txt-descricao').val(), $('#txt-telefone').val(), $('#txt-endereco').val(), mapSystem, $('#slc-moradia').val())
    }
})

$('.interruptor-box').click(function(){
    if($(this).hasClass('active')){
        $(this).children(".interruptor-ball").css({'transform': 'translateX(0)'})
        $(this).css({'background-color': 'white' })
    }
    else{
        $(this).children(".interruptor-ball").css({'transform': 'translateX(3em)'})
        $(this).css({'background-color': '#b3f5df' })
    }
    $(this).toggleClass('active')
    mapSystem.mostrarPorTipo(verificaInterruptor())
})
$(document).on("click", '.menu-closebtn', function(){
    $('#btn-anunciar').click()
})
$(document).on("click", '.tooltip-closebtn', function(){
    $(this).parent(".tooltip").css("visibility", "hidden")
    $(this).parent(".tooltiptext").css("visibility", "hidden")
})

$(window).on('resize', function(){
    $('.header').css({'height': '5em'})
    $('#icon-menu').css({'transform': 'rotate(0)'})
    $('.header-nav').css({'flex-direction': 'row'})
    if($('.mobile-menu').hasClass('active')){
        $('.mobile-menu').toggleClass('active')
    }
    if(!controlSystem.verifyIsMobile()){
        if(!$('#btn-painel-maps').hasClass('active')){
            $('#btn-painel-maps').click()
        }
        $('.header-choiced').css({'display': 'flex'})
        controlSystem.loadTooltip(controlSystem.tooltipMenuAlugarSJC, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogo, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuAnunciar, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogin, 2)
        $('#mn-sr').children('button.menu-closebtn').remove('button.menu-closebtn')
    } else{
        $('.header-choiced').css({'display': 'none'})
        controlSystem.loadTooltip(controlSystem.tooltipMenuAlugarSJC, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogo, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuAnunciar, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogin, 2)
        if($('#btn-painel-maps').hasClass('active')){
            $('#btn-painel-maps').click()
        }
        $('#mn-sr').append( "<button class='menu-closebtn'>X</button>")
    }

    $('.header-group').css({'flex-direction': 'row'})

})

$('.mobile-menu').click(function(){
    if($(this).hasClass('active')){
        $('.header-choiced').fadeOut(0)
        $('.header').css({'height': '5em'})
        //$('#icon-menu').css({'transform': 'rotate(0)'});
        $('.header-nav').css({'flex-direction': 'row'})
        $('.header-group').css({'flex-direction': 'row'})
    }
    else{
        $('.header-choiced').css("display", "flex").hide().fadeIn(500)
        $('.header').css({'height': '15em'})
        //$('#icon-menu').css({'transform': 'rotate(-90deg)'});
        $('.header-nav').css({'flex-direction': 'column-reverse'})
        $('.header-group').css({'flex-direction': 'column'})
        $('.tooltip-closebtn').click()

    }
    $(this).toggleClass('active')
})

const verificaInterruptor = () => {
    let listaVerificada = []
    $('#itr-apartamento').hasClass('active')? listaVerificada.push(false, true): listaVerificada.push(false, false) 
    $('#itr-casa').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false)
    $('#itr-republica').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false) 
    $('#itr-pensao').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false)
    return listaVerificada
}

$(document).ready(function(){
    $('select').selectric() //Inicia o select do anuncio
    if(!controlSystem.verifyIsMobile()){
        $('#btn-painel-maps').click()
        controlSystem.loadTooltip(controlSystem.tooltipMenuAlugarSJC, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogo, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuAnunciar, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogin, 2)
    } else{
        controlSystem.loadTooltip(controlSystem.tooltipMenuAlugarSJC, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogo, 1)
        controlSystem.loadTooltip(controlSystem.tooltipMenuAnunciar, 2)
        controlSystem.loadTooltip(controlSystem.tooltipMenuLogin, 2)
        $('#mn-sr').append( "<button class='menu-closebtn'>X</button>")
    }
    $('.interruptor-box').click()
    mapSystem.searchBox.addListener('places_changed', function() {
        var places = mapSystem.searchBox.getPlaces()  
        if (places.length == 0) {
            return
        }
        mapSystem.marcarTemporario(places[0].geometry.location.lat(), places[0].geometry.location.lng())
        controlSystem.check_A_endereco.fadeIn(500)
    })

})