// Definindo a classe ContactModel que gerencia os contatos e notifica os observadores sobre as mudanças
class ContactModel {
  constructor() {
    this.contacts = [];
    this.observers = []; // Lista de observadores que serão notificados sobre alterações
  }

  // Método para adicionar um novo contato
  addContact(contact) {
    this.contacts.push(contact);
    this.notifyObservers(); // Notifica os observadores sobre a mudança
  }

  // Método para atualizar um contato existente
  updateContact(index, updatedContact) {
    if (this.contacts[index]) { // Verifica se o índice do contato é válido
      this.contacts[index] = updatedContact; // Atualiza o contato no índice fornecido
      this.notifyObservers(); // Notifica os observadores sobre a mudança
    }
  }

  // Método para deletar um contato
  deleteContact(index) {
    this.contacts.splice(index, 1); // Remove o contato da lista no índice fornecido
    this.notifyObservers(); // Notifica os observadores sobre a mudança
  }

  // Método para obter todos os contatos
  getContacts() {
    return this.contacts;
  }

  // Método para adicionar um observador
  addObserver(observer) {
    this.observers.push(observer); // Adiciona um observador à lista
  }

  // Método para notificar todos os observadores sobre uma atualização
  notifyObservers() {
    this.observers.forEach((observer) => observer.update()); // Chama o método update de cada observador
  }
}

// Definindo a classe ContactView que gerencia a interface do usuário
class ContactView {
  constructor() {
    this.form = document.getElementById('contactForm'); // Referência ao formulário de contato
    this.nameInput = document.getElementById('nameInput'); // Referência ao campo de input para nome
    this.phoneInput = document.getElementById('phoneInput'); // Referência ao campo de input para telefone
    this.contactList = document.getElementById('contactList'); // Referência à lista de contatos exibida na UI
  }

  // Método para obter os dados do formulário
  getFormData() {
    return {
      name: this.nameInput.value, // Retorna o valor do input de nome
      phone: this.phoneInput.value, // Retorna o valor do input de telefone
    };
  }

  // Método para limpar o formulário após o envio
  clearForm() {
    this.nameInput.value = '';
    this.phoneInput.value = '';
  }

// Método para renderizar a lista de contatos na interface
renderContacts(contacts) {
    this.contactList.innerHTML = ''; // Limpa a lista de contatos na UI
    contacts.forEach((contact, index) => { // Itera sobre os contatos para renderizar cada um
        const li = document.createElement('li');
        li.textContent = `${contact.name}: ${contact.phone} `; // Exibe o nome e telefone do contato
        
        li.className = 'li-container'; // Classe para estilizar o item da lista

        const buttonContainer = document.createElement('div'); // Container para os botões

        const editButton = document.createElement('button'); // Botão de editar
        editButton.textContent = 'Editar';
        editButton.className = 'edit-button'; // Classe para estilizar o botão de editar
        editButton.onclick = () => this.handleEdit(index); // Define o evento de clique para editar o contato

        const deleteButton = document.createElement('button'); // Botão de deletar
        deleteButton.textContent = 'Deletar';
        deleteButton.className = 'delete-button'; // Classe para estilizar o botão de deletar
        deleteButton.onclick = () => this.handleDelete(index); // Define o evento de clique para deletar o contato

        buttonContainer.append(editButton, deleteButton); // Adiciona os botões ao container
        li.appendChild(buttonContainer); // Adiciona o container de botões ao item da lista
        this.contactList.append(li); // Adiciona o item à lista de contatos na UI
    });
}

  // Método para vincular o manipulador de adicionar contato ao formulário
  bindAddContact(handler) {
    this.form.onsubmit = (event) => {
      event.preventDefault();
      handler(this.getFormData()); // Chama o manipulador de adicionar contato com os dados do formulário
      this.clearForm(); // Limpa o formulário após o envio
    };
  }

  // Método para vincular o manipulador de editar contato
  bindEditContact(handler) {
    this.handleEdit = handler; // Armazena o manipulador de edição
  }

  // Método para vincular o manipulador de deletar contato
  bindDeleteContact(handler) {
    this.handleDelete = handler; // Armazena o manipulador de deleção
  }
}

// Definindo a classe ContactController que conecta o modelo e a visualização
class ContactController {
  constructor(model, view) {
    this.model = model; // Referência ao modelo
    this.view = view; // Referência à visualização

    this.view.bindAddContact(this.handleAddContact); // Vincula o manipulador de adicionar contato
    this.view.bindEditContact(this.handleEditContact); // Vincula o manipulador de editar contato
    this.view.bindDeleteContact(this.handleDeleteContact); // Vincula o manipulador de deletar contato

    this.model.addObserver(this); // Adiciona o controlador como um observador do modelo
    this.update(); // Renderiza a lista de contatos inicialmente
  }

  // Método para lidar com a adição de um novo contato
  handleAddContact = (contact) => {
    this.model.addContact(contact);
  };

  // Método para lidar com a edição de um contato
  handleEditContact = (index) => {
    const updatedContact = prompt(
      'Adicione um novo nome e telefone separados por vírgula:',
      `${this.model.getContacts()[index].name}, ${this.model.getContacts()[index].phone}`
    );
    if (updatedContact) { // Verifica se o usuário forneceu um novo valor
      const [name, phone] = updatedContact.split(',').map((s) => s.trim()); // Separa o nome e telefone e remove espaços
      this.model.updateContact(index, { name, phone }); // Atualiza o contato no modelo
    }
  };

  // Método para lidar com a deleção de um contato
  handleDeleteContact = (index) => {
    this.model.deleteContact(index);
  };

  // Método chamado quando o modelo notifica sobre mudanças
  update() {
    this.view.renderContacts(this.model.getContacts()); // Renderiza a lista de contatos atualizada na UI
  }
}

// Quando o documento estiver totalmente carregado, cria as instâncias do modelo, da visualização e do controlador
document.addEventListener('DOMContentLoaded', () => {
  const model = new ContactModel();
  const view = new ContactView();
  
  new ContactController(model, view); // Inicializa o controlador com o modelo e a visualização
});