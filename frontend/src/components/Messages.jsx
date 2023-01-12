export default function Messages({ messages, dismissMessage }) {
  return (
    <div>
      {Object.entries(messages).map(([type, messages]) =>
        <div key={type}>
          {messages.map((message, i) => <div key={i} onClick={() => dismissMessage(type, i)}>{message}</div>)}
        </div>
      )}
    </div>
  )
}