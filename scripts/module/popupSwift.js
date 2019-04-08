function popupSwift (place, title, data){
    console.log("Ativou")
    place.toggleClass('popupSwift')

    var content = "<div class='popupSwift-title'>"+title+"</div>" + "<div class='popupSwift-text'>"+ data +"</div>"
    place.html(content)
    console.log("Funcionou")

}
