let = modalQt = 1;
const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);

//Listagem das Pizzas
pizzaJson.map((item, index)=>{

    //Clonar o modelo das pizzas
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    //Preencher as informações em pizzaItem (preço, nome e descrição) e ID para ser usado no MODAL
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //configurando tag (a) do html ao clicar não atualizar a tela
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        
        //Seleciona a classe pizza-item mais proxima
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;

        // Preencher o MODAL, para quando aparecer ao usuário todas as info já está carregadas
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //Limpar a seleção do tamanho da pizza 
        c('.pizzaInfo--size.selected').classList.remove('selected');

        //Selecionar o tamanho da pizza, mas deixa como padrão a pizza G
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) size.classList.add('selected');
            //Preencher ao tamanha as gramas do mesmo
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //Para alterar a quantidade de pizza no MODAL, deixando como default = 1
        c('.pizzaInfo--qt').innerHTML = pizzaJson[key].modalQt;

        // Para aparecer a pagina de display => MODAL
        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = 'flex';
        setTimeout(()=>{
            c(".pizzaWindowArea").style.opacity = 1;
        },200);
    });


    // Acrescenta as pizzas por meio do append();
    c('.pizza-area').append(pizzaItem);
});

//Eventos MODAL
function closeModal(){
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(()=>{
        c(".pizzaWindowArea").style.display = 'none';
    },500);
}
// Evento de fechar o MODAL (WEB e MOBILE)
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});