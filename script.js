let = modalQt = 1;
let cart = [];
let moralKey = 0;

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
        modalkey = key;

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
        c('.pizzaInfo--qt').innerHTML = modalQt;

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

//Evento de MODALQT => Quantidade de pizza
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.pizzaInfo--qt').innerHTML = modalQt;
});

//Evento para selecionar tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Evento de adicionar pizza ao carrinho => (Qual a pizza, qual o tamanho e quantas pizza)
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalkey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalkey].id,
            size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

//Eventos de carrinho MOBILE
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) c('aside').style.left = '0';
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

// Evento do carrinho de compras
function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            
            //Adicionar o tamanho das pizzas
            let pizzaSizeName;
            switch (cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case  1:
                    pizzaSizeName = 'M';
                    break;    
                case  2:
                    pizzaSizeName = 'G';
                    break;                    
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; 
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //Alterar a quantidade de pizzas no carrinho, quando for zero, a pizza é removida
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i,1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            // Acrescenta as pizzas no carrinho
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}