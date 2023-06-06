//seleciona o form do html e evita q ele recarregue a pagina ao dar submit
const form = document.getElementById('formularioUser')
form.addEventListener('submit', function(event) {
  event.preventDefault();
});

//função async await para buscar infos do cep
async function buscarCep(cep) {
  //remove o traço do input
  const cepSemTracos = cep.replace(/-/g, '');
  //testa se o input é um cep valido
  const cepValido = /^\d{8}$/.test(cepSemTracos);
  //se cep não for valido (false) lança um alert de erro
  if (!cepValido) {
    alert(`O CEP ${cep} é inválido`);
    location.reload()
    return;
  }
  //bloco try catch para fazer a requisição do viacep e retornar um resultado em json ou um erro em caso de falha na requisição
  try {
    //captura a resposta da requisição
    const response = await fetch(`https://viacep.com.br/ws/${cepSemTracos}/json/`);

    //transforma a resposta em json
    const endereco = await response.json();

    //prepara um objeto para ser retornado no final da função
    const resultado = {
      cep: endereco.cep,
      estado: endereco.uf,
      cidade: endereco.localidade,
      bairro: endereco.bairro,
      logradouro: endereco.logradouro
    };

    return resultado;
  //captura o erro em caso de falha na comunicação entre servidores
  } catch (error) {
    console.log('Ocorreu um erro:', error);
  }
}


//função para adicionar usuarios em localStorage
async function addUser(){
  //variaveis recebem os valores dos inputs do html
  let nameUser = document.getElementById('nameUser').value
  let emailUser = document.getElementById('emailUser').value
  let cepUser = document.getElementById('cepUser').value
    
  try {
    //chama a função buscarCep para definir a variavel que recebe o objeto 'resultado' da linha 28 
      const enderecoUser = await buscarCep(cepUser);

      //usando os valores de resultado, cria um objeto usando usuario 
      const usuario = {
        nome: nameUser,
        email: emailUser,
        cep: enderecoUser.cep,
        estado: enderecoUser.estado,
        cidade: enderecoUser.cidade,
        bairro: enderecoUser.bairro,
        logradouro: enderecoUser.logradouro
      };
  
      //verifica se ja existe informações no localStorage
      let usuarios = localStorage.getItem('usuarios');

      //se sim, adiciona o novo objeto de usuario ao final
      if (usuarios) {
        usuarios = JSON.parse(usuarios);
        usuarios.push(usuario);

      //se não, define usuarios sendo array do usuario criado
      } else {
        usuarios = [usuario];
      }
      //adiciona em forma de string para que seja legivel pelo navegador, todos os usuarios e recarrega a pagina
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      location.reload()
    
    //e captura o erro em caso de falha na comunicação entre servidores 
    } catch (error) {
      console.log('Ocorreu um erro:', error);
    }

}

//função para mostrar na tela todos os usuarios ja cadastrados armazenados em localstorage
function showUsers() {

  //recebe e adiciona em um array a string transformada em json que veio do localStorage
  const users = localStorage.getItem('usuarios');
  const arrayUsers = JSON.parse(users);

  //captura do html o elemento <ul>
  let list = document.getElementById('listUsers')

  //para cada elemento dentro do objeto presente no array, cria um <li> e adiciona uma string utilizando informações do proprio elemento do objeto
  arrayUsers.forEach(user => {
    const itemLista = document.createElement('li')
    itemLista.textContent = `Nome: ${user.nome}, Email: ${user.email}, CEP: ${user.cep}, Logradouro: ${user.logradouro}, Estado: ${user.estado}, Cidade: ${user.cidade}, Bairro: ${user.bairro}`

    //adiciona o item criado dentro da lista capturada na linha 97
    list.append(itemLista)
  });
}

//todas as funções garante que a tela seja recarregada para que a função showUsers execute a cada usuario adicionado ou removido, por isso a chamada da função na linha 110 
showUsers()

//função para limpar o localStorage e recarregar a tela
function clearLocalStorage(){
    localStorage.clear()
    location.reload()
}



