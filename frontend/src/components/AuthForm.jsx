export default function AuthForm({ attemptAuth }) {
  function attemptAuthWithData(type, form) {
    return attemptAuth(type, form.elements.username.value, form.elements.password.value);
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      return attemptAuthWithData('login', e.currentTarget);
    }}>
      <label>Username: <input name="username" type="text" /></label>
      <label>Password: <input name="password" type="password" /></label>
      <button type="submit">Login</button>
      <button type="button" onClick={(e) => {
        e.preventDefault();
        return attemptAuthWithData('signup', e.currentTarget.closest('form'));
      }}>Signup</button>
    </form>
  )
}