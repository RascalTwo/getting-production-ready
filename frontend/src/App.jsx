import useMessages from './hooks/useMessages';
import useUser from './hooks/useUser';
import useCount from './hooks/useCount';
import AuthForm from './components/AuthForm';
import Messages from './components/Messages';
import Counter from './components/Counter';

export default function App() {
  const [messages, setMessages, dismissMessage] = useMessages();
  const [user, attemptAuth] = useUser(setMessages);
  const [count, changeCounter] = useCount(user);


  let content;
  if (user === undefined) {
    content = <h1>Loading user...</h1>
  }
  else if (user === null) {
    content = <AuthForm attemptAuth={attemptAuth} />
  }
  else if (count === undefined) {
    content = <h1>Loading counter...</h1>
  }
  else if (!content) {
    content = <Counter count={count} changeCounter={changeCounter} />
  }

  return (
    <div>
      <Messages messages={messages} dismissMessage={dismissMessage} />
      {content}
    </div>
  )
}
