// Aula 01:
import "./css/index.css"
// isso é possivel por causa do VITE.
// Vite: é um empacotador, serve para ter mais dinamismo na hora de codar, trazer CSS e imagens para dentro do projeto.
// Para usar o vite em outros projetos é só instalá-lo: npm create vite@latest
import IMask from "imask"

// cor cartão / usa-se o . quando for Classe
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

// logo: visa, mastercard ou default
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// setCardType("mastercard")
globalThis.setCardType = setCardType // serve para poder mudar as coisas no console.

// Aula 02:
// código de segurança - CVC / usa-se # quando for ID
const securityCode = document.querySelector("#security-code")
// usando o IMask:
const securityCodePattern = {
  mask: "0000", // padrão da máscara IMask - 4 dígitos
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// expiração do cartão - formato de data (mês e ano)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY", // padrão da máscara IMask - mês/ano
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), // comando para pegar o ano atual
      to: String(new Date().getFullYear() + 10).slice(2), // pega dez anos para frente
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1, // mês 01 ao mês 12
      to: 12,
    },
  }, // é um objeto que recebe valores: MM (mês) e YY(ano)
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// número do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    // regras para o cartão visa:
    // inicia com 4 seguido de mais 15 dígitos
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    // regras para o cartão mastercard:
    // inicia com 5, seguido de um dígito 1 e 5, seguido de mais 2 dígitos OU
    // inicia com 22, seguido de um dígito 2 e 9, seguido de mais 1 dígito OU
    // inicia com 2, seguido de um dígito 3 e 7, seguido de mais 2 dígitos
    // seguido de mais 12 dígistos
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  // dispatch: uma função que vai receber dois argumentos:
  // appended: toda vez que digitar uma tecla, a função roda e um número será adicionado;
  // dynamicMasked: máscara dinâmica criada, pega tudo que não for digito e troca por vazio.
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Aula 03:
// BOTÃO Adicionar Cartão - evento de click
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão Adicionado!")
})
// addEventListener: escuta, observa o elemento addButton

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() //preventDefault: impede que a página recarregue
})

// capturar o NOME DO TITULAR para que apareça no cartão
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  // innerText: muda o conteúdo
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

// captutrar o CÓDIGO DE SEGURANÇA - CVC para que apareça no cartão
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
  // .on é a mesma lógica do addEventListener
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

// captutrar o NÚMERO DO CARTÃO para que apareça no cartão
cardNumberMasked.on("accept", () => {
  // atualiza as bandeiras (visa, master ou default) e as cores no cartão
  // busca o tipo do cartão
  const cardType = cardNumberMasked.masked.currentMask.cardtype

  // passa o tipo do cartão
  setCardType(cardType)

  // atualiza os dados (números) no cartão
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// captutrar a DATA DE EXPIRAÇÃO para que apareça no cartão
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
