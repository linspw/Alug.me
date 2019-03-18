$('#btn-anunciar').click(function(){
    if($('.menu-side-right').hasClass('active')){
        $("#mn-sr").fadeOut(500)
        $(".menu-wrapper").fadeOut(0)
        document.getElementById("mn-sr").style.width = "0em"
    }
    else{
        $("#mn-sr").css("display", "flex").hide().fadeIn(500)
        $(".menu-wrapper").css("display", "flex").hide().fadeIn(500)
        document.getElementById("mn-sr").style.width = "20em"
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
        document.getElementById("painel-maps").style.width = "19em"
        document.getElementById("painel-maps").style.height = "15em"
        $("#icon-painel-map").css({'transform': 'rotate(-90deg)'})
        $(".painel-maps-wrapper").fadeIn(500)

    }
    $(this).toggleClass('active')
})

$('#btn-anunciar-enviar').click(function(){
    map1.reload()
    map1.pesquisarEndereco($('#txt-endereco').val())
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
    map1.showByType(verificaInterruptor())
})

const verificaInterruptor = () => {
    let listaVerificada = []
    $('#itr-apartamento').hasClass('active')? listaVerificada.push(false, true): listaVerificada.push(false, false) 
    $('#itr-casa').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false)
    $('#itr-republica').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false) 
    $('#itr-pensao').hasClass('active')? listaVerificada.push(true): listaVerificada.push(false)
    return listaVerificada
}
const verificaAnunciarSlots = () => {
}
$(document).ready(function(){
    $('select').selectric()
    $('#btn-painel-maps').click()
    $('.interruptor-box').click()
})