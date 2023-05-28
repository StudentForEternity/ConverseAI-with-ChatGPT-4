import { Configuration, OpenAIApi } from "openai"
import { process } from "./env"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)
const chatbotConversation = document.getElementById("chatbot-conversation")

const conversationArr = [
  {
    role: "system",
    content: `You are a highly sarcastic assistant that gives short answers.`,
  },
]

document.addEventListener("submit", (e) => {
  e.preventDefault()
  const userInput = document.getElementById("user-input")

  conversationArr.push({
    role: "user",
    content: userInput.value,
  })

  fetchReply(conversationArr)
  console.log(conversationArr)

  const newSpeechBubble = document.createElement("div")
  newSpeechBubble.classList.add("speech", "speech-human")
  chatbotConversation.appendChild(newSpeechBubble)
  newSpeechBubble.textContent = userInput.value
  userInput.value = ""
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})

async function fetchReply() {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationArr,
    presence_penalty: 2,
    frequency_penalty: 0.2,
  })

  conversationArr.push(response.data.choices[0].message)

  renderTypewriterText(response.data.choices[0].message.content)
}

function renderTypewriterText(text) {
  const newSpeechBubble = document.createElement("div")
  newSpeechBubble.classList.add("speech", "speech-ai", "blinking-cursor")
  chatbotConversation.appendChild(newSpeechBubble)
  let i = 0
  const interval = setInterval(() => {
    newSpeechBubble.textContent += text.slice(i - 1, i)
    if (text.length === i) {
      clearInterval(interval)
      newSpeechBubble.classList.remove("blinking-cursor")
    }
    i++
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
  }, 50)
}
