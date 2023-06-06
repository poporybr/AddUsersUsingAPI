// const form = document.getElementById('formularioUser')
// form.addEventListener('submit', function(event) {
//   event.preventDefault();
// });

async function buscarCep(cep) {
  const cepSemTracos = cep.replace(/-/g, '');

  const cepValido = /^\d{8}$/.test(cepSemTracos);
  
  if (!cepValido) {
    alert(`O CEP ${cep} é inválido`);
    return;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepSemTracos}/json/`);
    const endereco = await response.json();

    if (endereco.erro) {
      alert(`O CEP ${cep} é inválido`);
    } else {
      const resultado = {
        cep: endereco.cep,
        estado: endereco.uf,
        cidade: endereco.localidade,
        bairro: endereco.bairro,
        logradouro: endereco.logradouro
      };

      console.log(resultado);
      return resultado;
    }
  } catch (error) {
    console.log('Ocorreu um erro:', error);
  }
}



async function addUser(){
  let nameUser = document.getElementById('nameUser').value
  let emailUser = document.getElementById('emailUser').value
  let cepUser = document.getElementById('cepUser').value
    
  try {
      const enderecoUser = await buscarCep(cepUser);
      console.log(enderecoUser);
  
      const usuario = {
        nome: nameUser,
        email: emailUser,
        cep: enderecoUser.cep,
        estado: enderecoUser.estado,
        cidade: enderecoUser.cidade,
        bairro: enderecoUser.bairro,
        logradouro: enderecoUser.logradouro
      };
  
      console.log(usuario);
  
      let usuarios = localStorage.getItem('usuarios');
      if (usuarios) {
        usuarios = JSON.parse(usuarios);
        usuarios.push(usuario);
      } else {
        usuarios = [usuario];
      }
  
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } catch (error) {
      console.log('Ocorreu um erro:', error);
    }

}

function showUsers() {
    const users = localStorage.getItem('usuarios');
    const arrayUsers = JSON.parse(users);
    let list = document.getElementById('listUsers')
    arrayUsers.forEach(user => {
      const itemLista = document.createElement('li')
      itemLista.textContent = `Nome: ${user.nome}, Email: ${user.email}, CEP: ${user.cep}, Logradouro: ${user.logradouro}, Estado: ${user.estado}, Cidade: ${user.cidade}, Bairro: ${user.bairro}`
      list.append(itemLista)
    });
}

showUsers()

function clearLocalStorage(){
    localStorage.clear()
}



