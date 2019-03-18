function inicializar(){
    inicializarMapa();
}
function reloadMarkers(){
    if($('#itr-apartamento').hasClass('active')){
        var apartamento=1
    }else{apartamento=0}
    if($('#itr-casa').hasClass('active')){
        var casa=1
    }else{casa=0}
    if($('#itr-republica').hasClass('active')){
        var republica=1
    }else{republica=0}
    if($('#itr-pensao').hasClass('active')){
        var pensao=1
    }else{pensao=0}
    carregarMarcadores(apartamento, casa, republica, pensao)
}
function toggleZone(){
    
}
function verificaSlots(){
    if($('#txt-titulo').val() && $('#txt-autor').val() && $('#txt-telefone').val() && $('#txt-endereco').val()){
        console.log("Autorizado!")
        return 1
    }
    else{
        console.log("Não autorizado!")
        return 0
    }
}

$('#btn-painel-maps').click(function(){
    if($(this).hasClass('active')){
        document.getElementById("painel-maps").style.width = "3em"
        document.getElementById("painel-maps").style.height = "3em"
        $("#icon-painel-map").css({'transform': 'rotate(0deg)'})
        $(".painel-maps-wrapper").fadeOut(500)
    }
    else{
        document.getElementById("painel-maps").style.width = "15em"
        document.getElementById("painel-maps").style.height = "14em"
        $("#icon-painel-map").css({'transform': 'rotate(-90deg)'})
        $(".painel-maps-wrapper").fadeIn(500)

    }
    $(this).toggleClass('active')
})

$('#btn-anunciar').click(function(){
    if($('.menu-side-right').hasClass('active')){
        $("#mn-sr").fadeOut(550)
        document.getElementById("mn-sr").style.width = "0em"
    }
    else{
        $("#mn-sr").fadeIn(550)
        document.getElementById("mn-sr").style.width = "20em"
    }
    $('.menu-side-right').toggleClass('active')
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
    reloadMarkers()
})
$('#btn-anunciar-enviar').click(function(){
    if(verificaSlots()){
        pesquisarAdicionarEndereco($('#txt-endereco').val(), $('#txt-telefone').val(), $('#slc-moradia').val(), $('#txt-titulo').val())
    }
})


$(document).ready(function(){
    inicializar();
    $('.interruptor-box').trigger('click')
    $('#btn-painel-maps').trigger('click')
    $('#btn-anunciar').trigger('click')

})
